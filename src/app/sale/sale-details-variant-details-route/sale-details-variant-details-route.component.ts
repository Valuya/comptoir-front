import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsItemVariantSale, WsItemVariantSaleRef, WsSale} from '@valuya/comptoir-ws-api';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {NavigationService} from '../../navigation.service';
import {map, mergeMap, publishReplay, refCount, switchMap} from 'rxjs/operators';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {SaleService} from '../../domain/commercial/sale.service';

@Component({
  selector: 'cp-sale-details-variant-details-route',
  templateUrl: './sale-details-variant-details-route.component.html',
  styleUrls: ['./sale-details-variant-details-route.component.scss']
})
export class SaleDetailsVariantDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsItemVariantSale>;

  private subscription: Subscription;
  sale$: Observable<WsSale | null>;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private saleService: SaleService,
  ) {
  }

  ngOnInit() {
    this.formHelper = new ShellFormHelper<WsItemVariantSale>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
    this.subscription = this.activatedRoute.data.pipe(
      map(data => data.saleVariant),
    ).subscribe(saleVariant => this.formHelper.init(saleVariant));

    const sale$List = this.activatedRoute.pathFromRoot.map(
      route => route.data.pipe(map(data => data.sale))
    );
    this.sale$ = combineLatest(...sale$List).pipe(
      map(list => list.find(sale => sale != null)),
      publishReplay(1), refCount(),
    );
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedSaleVariant => this.onSaveSuccess(updatedSaleVariant),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving saleVariant`,
        detail: `${error}`
      })
    );
  }

  private onSaveSuccess(updatedSaleVariant) {
    this.messageService.add({
      severity: 'success',
      summary: `SaleVariant ${updatedSaleVariant.id} saved`
    });
    this.navigationService.navigateBackWithRedirectCheck();
  }

  private validate$(value: WsItemVariantSale): Observable<ValidationResult<WsItemVariantSale>> {
    return of(ValidationResultFactory.emptyResults<WsItemVariantSale>());
  }

  private persist$(value: WsItemVariantSale): Observable<WsItemVariantSale> {
    return this.saleService.saveVariant(value).pipe(
      switchMap(ref => this.saleService.getVariant$(ref))
    );
  }

}
