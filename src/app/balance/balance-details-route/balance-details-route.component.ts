import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsBalance, WsBalanceRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';
import {BalanceService} from '../../domain/accounting/balance.service';

@Component({
  selector: 'cp-balances-details-route',
  templateUrl: './balance-details-route.component.html',
  styleUrls: ['./balance-details-route.component.scss'],

})
export class BalanceDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsBalance>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private balanceService: BalanceService) {
    this.formHelper = new ShellFormHelper<WsBalance>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.data.pipe(
      map(data => data.balance),
    ).subscribe(balance => this.formHelper.init(balance));
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
    return this.balanceService.saveBalance(value);
  }
}
