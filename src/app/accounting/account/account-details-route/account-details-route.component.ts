import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../../app-shell/shell-details-form/shell-form-helper';
import {WsAccount, WsAccountRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ValidationResult} from '../../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../../navigation.service';
import {AccountService} from '../../../domain/accounting/account.service';
import {RouteUtils} from '../../../util/route-utils';

@Component({
  selector: 'cp-accounts-details-route',
  templateUrl: './account-details-route.component.html',
  styleUrls: ['./account-details-route.component.scss'],
})
export class AccountDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsAccount>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private accountService: AccountService) {
    this.formHelper = new ShellFormHelper<WsAccount>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'account')
      .subscribe(account => this.formHelper.init(account));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedAccount => this.onSaveSuccess(updatedAccount),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving account`,
        detail: `${error}`
      })
    );
  }

  private onSaveSuccess(updatedAccount) {
    this.messageService.add({
      severity: 'success',
      summary: `Account ${updatedAccount.id} saved`
    });
    this.navigationService.navigateBackOrToParentWithRedirectCheck();
  }

  private validate$(value: WsAccount): Observable<ValidationResult<WsAccount>> {
    return of(ValidationResultFactory.emptyResults<WsAccount>());
  }

  private persist$(value: WsAccount): Observable<WsAccount> {
    return this.accountService.saveAccount(value);
  }
}
