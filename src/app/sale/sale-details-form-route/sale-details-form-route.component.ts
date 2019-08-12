import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsSale} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {NavigationService} from '../../navigation.service';
import {SaleService} from '../../domain/commercial/sale.service';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-sale-details-form-route',
  templateUrl: './sale-details-form-route.component.html',
  styleUrls: ['./sale-details-form-route.component.scss']
})
export class SaleDetailsFormRouteComponent implements OnInit, OnDestroy {
  formHelper: ShellFormHelper<WsSale>;
  private subscription: Subscription;

  constructor(
    private saleService: SaleService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private navigationService: NavigationService,
  ) {
  }

  ngOnInit() {
    this.formHelper = new ShellFormHelper<WsSale>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
    this.subscription = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'sale')
      .subscribe(sale => this.formHelper.init(sale));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedSale => this.onSaveSuccess(updatedSale),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving sale`,
        detail: `${error}`
      })
    );
  }


  private onSaveSuccess(updatedSale) {
    this.messageService.add({
      severity: 'success',
      summary: `Sale ${updatedSale.id} saved`
    });
    this.navigationService.navigateBackOrToParentWithRedirectCheck();
  }

  private validate$(value: WsSale): Observable<ValidationResult<WsSale>> {
    return of(ValidationResultFactory.emptyResults<WsSale>());
  }

  private persist$(value: WsSale): Observable<WsSale> {
    return this.saleService.saveSale(value).pipe(
      switchMap(ref => this.saleService.getSale$(ref))
    );
  }

}
