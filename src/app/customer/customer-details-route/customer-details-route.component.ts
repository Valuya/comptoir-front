import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsCustomer, WsCustomerRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';
import {CustomerService} from '../../domain/thirdparty/customer.service';

@Component({
  selector: 'cp-customers-details-route',
  templateUrl: './customer-details-route.component.html',
  styleUrls: ['./customer-details-route.component.scss'],

})
export class CustomerDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsCustomer>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private customerService: CustomerService,
  ) {
    this.formHelper = new ShellFormHelper<WsCustomer>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.data.pipe(
      map(data => data.customer),
    ).subscribe(customer => this.formHelper.init(customer));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedCustomer => this.onSaveSuccess(updatedCustomer),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving customer`,
        detail: `${error}`
      })
    );
  }

  private onSaveSuccess(updatedCustomer) {
    this.messageService.add({
      severity: 'success',
      summary: `Customer ${updatedCustomer.id} saved`
    });
    this.navigationService.navigateBackWithRedirectCheck();
  }

  private validate$(value: WsCustomer): Observable<ValidationResult<WsCustomer>> {
    return of(ValidationResultFactory.emptyResults<WsCustomer>());
  }

  private persist$(value: WsCustomer): Observable<WsCustomer> {
    return this.customerService.saveCustomer(value).pipe(
      mergeMap(ref => this.customerService.getCustomer$(ref))
    );
  }
}
