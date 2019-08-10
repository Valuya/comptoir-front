import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsAccountRef, WsAccountSearch, WsBalance, WsBalanceRef, WsCompanyRef, WsMoneyPile} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, combineLatest, concat, forkJoin, Observable, of, Subject, Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {catchError, debounceTime, map, mergeMap, publishReplay, refCount, switchMap, take, toArray} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';
import {BalanceService} from '../../domain/accounting/balance.service';
import {PaginationUtils} from '../../util/pagination-utils';
import {AuthService} from '../../auth.service';
import {AccountService} from '../../domain/accounting/account.service';
import {WsAttributeDefinitionSearchResultList} from '@valuya/comptoir-ws-api/models/WsAttributeDefinitionSearchResultList';

@Component({
  selector: 'cp-balances-details-route',
  templateUrl: './balance-details-route.component.html',
  styleUrls: ['./balance-details-route.component.scss'],

})
export class BalanceDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsBalance>;
  moneyPileFormVisible: boolean;

  moneyPiles$ = new BehaviorSubject<WsMoneyPile[]>([]);
  moneyPilesTotal$: Observable<number>;

  private pileChangeSource$ = new Subject<WsMoneyPile[]>();

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private accountService: AccountService,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private balanceService: BalanceService) {
    this.formHelper = new ShellFormHelper<WsBalance>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = new Subscription();
    const routeSubscription = this.activatedRoute.data.pipe(
      map(data => data.balance),
    ).subscribe(balance => this.formHelper.init(balance));
    this.subscription.add(routeSubscription);

    const moneyPileSusbcription = this.pileChangeSource$.pipe(
      debounceTime(500),
      switchMap(piles => this.persistPiles$(piles))
    ).subscribe(
      () => this.onPilesSaveSuccess(),
      error => this.onPileSaveError(error)
    );
    this.subscription.add(moneyPileSusbcription);

    this.moneyPilesTotal$ = this.moneyPiles$.pipe(
      map(piles => this.calcPilesTotal(piles)),
      publishReplay(1), refCount()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedBalance => this.onSaveSuccess(updatedBalance),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving balance`,
        detail: `${error}`
      })
    );
  }

  onCountCashClick(count: boolean) {
    const balance$ = this.formHelper.editingValue$.pipe(
      take(1),
      publishReplay(1), refCount()
    );
    if (count) {
      const cashAccountRef$ = this.findCashAccountRef$();
      forkJoin(balance$, cashAccountRef$).pipe(
        switchMap(result => this.openNewCashBalance$(result[0], result[1]))
      ).subscribe(
        balance => {
          this.formHelper.init(balance);
          this.moneyPileFormVisible = true;
          this.findOrCreateMoneyPiles$(balance)
            .subscribe(piles => this.moneyPiles$.next(piles));

          this.router.navigate(['../', balance.id], {
            replaceUrl: true,
            relativeTo: this.activatedRoute
          });
        },
        error => this.onCreateBalanceError(error)
      );
    }
  }

  onMoneyPilesChange(piles: WsMoneyPile[]) {
    this.moneyPiles$.next(piles);
    this.pileChangeSource$.next(piles);
  }

  private findCashAccountRef$(): Observable<WsAccountRef | null> {
    return this.authService.getNextNonNullLoggedEmployeeCompanyRef$().pipe(
      map(companyRef => this.createCachAccountFilter(companyRef)),
      switchMap(searchFilter => this.accountService.searchAccountList$(searchFilter, PaginationUtils.create(1))),
      map(result => result.list.length < 1 ? null : result.list[0]),
    );
  }

  private createCachAccountFilter(companyRef: WsCompanyRef): WsAccountSearch {
    return {
      cash: true,
      companyRef: companyRef as object
    };
  }

  private onSaveSuccess(updatedBalance) {
    this.messageService.add({
      severity: 'success',
      summary: `Balance ${updatedBalance.id} saved`
    });
    this.navigationService.navigateBackWithRedirectCheck();
  }

  private validate$(value: WsBalance): Observable<ValidationResult<WsBalance>> {
    return of(ValidationResultFactory.emptyResults<WsBalance>());
  }

  private persist$(value: WsBalance): Observable<WsBalance> {
    return this.balanceService.saveBalance(value).pipe(
      switchMap(ref => this.balanceService.closeBlance$(ref))
    );
  }

  private openNewCashBalance$(balance: WsBalance, cashAccountRef: WsAccountRef | null): Observable<WsBalance> {
    if (balance == null || cashAccountRef == null || balance.closed || balance.id != null) {
      throw new Error(`Unable to open a new balance`);
    }
    balance.accountRef = cashAccountRef;
    balance.dateTime = new Date();
    return this.balanceService.saveBalance(balance).pipe(
      switchMap(ref => this.balanceService.getBalance$(ref))
    );
  }


  private findOrCreateMoneyPiles$(balance: WsBalance): Observable<WsMoneyPile[]> {
    if (balance == null || balance.id == null || balance.accountRef == null) {
      return of([]);
    }
    const balanceRef: WsBalanceRef = {id: balance.id};
    const accountRef: WsAccountRef = {id: balance.accountRef.id};

    return of(200, 100, 50, 20, 10, 2, 1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01).pipe(
      map(amount => {
        return {
          balanceRef: balanceRef as WsAttributeDefinitionSearchResultList,
          accountRef: accountRef as WsAttributeDefinitionSearchResultList,
          unitAmount: amount,
          count: 0,
          total: 0,
          dateTime: new Date(),
        } as WsMoneyPile;
      }),
      toArray(),
      switchMap(piles => this.persistPiles$(piles)),
      catchError(e => {
        this.onMoneyPileCreationError(e);
        return of([]);
      })
    );
  }

  private persistPiles$(piles: WsMoneyPile[]): Observable<WsMoneyPile[]> {
    const pile$List = piles.map(pile => {
      return this.balanceService.saveMoneyPile(pile).pipe(
        switchMap(ref => this.balanceService.getMoneyPile(ref))
      );
    });
    // FIXME:  Forking in parallle causes dedlock on backend
    return pile$List.length === 0 ? of([]) : concat(...pile$List).pipe(toArray());
  }


  private calcPilesTotal(piles: WsMoneyPile[]) {
    return piles.reduce((c, n) => c + n.total, 0);
  }

  private onPilesSaveSuccess() {
    this.messageService.add({
      severity: 'info',
      summary: 'Count saved',
      life: 500
    });
    this.formHelper.editingValue$.pipe(
      take(1),
      switchMap(b => this.balanceService.getBalance$({id: b.id}, true)),
    ).subscribe(balance => this.formHelper.init(balance));
  }

  private onPileSaveError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Could not save pile',
      detail: error,
      sticky: true,
      closable: true
    });
  }

  private onCreateBalanceError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Could not create balance',
      detail: error,
      sticky: true,
      closable: true
    });
  }

  private onMoneyPileCreationError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Could not create money pile',
      detail: error,
      sticky: true,
      closable: true
    });
  }
}
