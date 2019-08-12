import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsInvoice} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';
import {InvoiceService} from '../../domain/commercial/invoice.service';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-invoices-details-route',
  templateUrl: './invoice-details-route.component.html',
  styleUrls: ['./invoice-details-route.component.scss'],

})
export class InvoiceDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsInvoice>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private invoiceService: InvoiceService,
  ) {
    this.formHelper = new ShellFormHelper<WsInvoice>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'invoice')
      .subscribe(invoice => this.formHelper.init(invoice));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedInvoice => this.onSaveSuccess(updatedInvoice),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving invoice`,
        detail: `${error}`
      })
    );
  }

  private onSaveSuccess(updatedInvoice) {
    this.messageService.add({
      severity: 'success',
      summary: `Invoice ${updatedInvoice.id} saved`
    });
    this.navigationService.navigateBackWithRedirectCheck();
  }

  private validate$(value: WsInvoice): Observable<ValidationResult<WsInvoice>> {
    return of(ValidationResultFactory.emptyResults<WsInvoice>());
  }

  private persist$(value: WsInvoice): Observable<WsInvoice> {
    return this.invoiceService.saveInvoice(value).pipe(
      mergeMap(ref => this.invoiceService.getInvoice$(ref))
    );
  }
}
