import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {WsAccountRef, WsAccountSearch, WsAccountSearchAccountTypeEnum, WsCompanyRef, WsPosRef} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {map} from 'rxjs/operators';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {PaginationUtils} from '../../util/pagination-utils';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {LazyLoadEvent, SelectItem} from 'primeng/api';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {AccountService} from '../../domain/accounting/account.service';
import {NAME_COLUMN} from '../../accounting/account/account-column/account-columns';

@Component({
  selector: 'cp-account-select-list',
  templateUrl: './account-select-list.component.html',
  styleUrls: ['./account-select-list.component.scss']
})
export class AccountSelectListComponent implements OnInit, OnDestroy {

  @Input()
  viewLayout: 'list' | 'grid' = 'list';

  @Input()
  set posRef(value: WsPosRef | null) {
    this.posRefSource$.next(value);
  }

  @Output()
  accountSelect = new EventEmitter<WsAccountRef>();

  tableHelper: ShellTableHelper<WsAccountRef, WsAccountSearch>;

  sortOptions: SelectItem[];

  private posRefSource$ = new BehaviorSubject<WsPosRef | null>(null);

  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
  ) {
  }

  ngOnInit() {
    this.subscription = new Subscription();
    this.tableHelper = new ShellTableHelper<WsAccountRef, WsAccountSearch>(
      (filter, pagination) => this.searchAccounts$(filter, pagination)
    );
    this.sortOptions = this.createSortOptions();
    this.tableHelper.setPagination(PaginationUtils.createWithSort(
      NAME_COLUMN.value
    ));

    const companyRef$ = this.authService.getLoggedEmployeeCompanyRef$();
    const searchFilterSubscription = combineLatest(
      companyRef$,
      this.posRefSource$
    ).pipe(
      map(r => this.createSearchFilter(r[0], r[1])),
    ).subscribe(searchFilter => this.tableHelper.setFilter(searchFilter));
    this.subscription.add(searchFilterSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLazyLoad(event: LazyLoadEvent) {
    const pagination = PaginationUtils.createFromEvent(event);
    this.tableHelper.setPagination(pagination);
  }

  onSortFieldChange($event: any) {
  }

  onAccountClick(ref: WsAccountRef) {
    this.accountSelect.emit(ref);
  }

  private createSearchFilter(companyRef: WsCompanyRef | null, posRefValue?: WsPosRef | null): WsAccountSearch {
    if (companyRef == null) {
      return null;
    }
    return {
      companyRef: companyRef as object,
      accountType: WsAccountSearchAccountTypeEnum.PAYMENT,
      posRef: posRefValue,
    };
  }

  private searchAccounts$(filter: WsAccountSearch, pagination: Pagination): Observable<SearchResult<WsAccountRef>> {
    if (filter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.accountService.searchAccountList$(filter, pagination);
  }

  private createSortOptions() {
    return [
      NAME_COLUMN,
    ].map(col => {
      return {
        value: col.value,
        label: col.header,
      } as SelectItem;
    });
  }

}
