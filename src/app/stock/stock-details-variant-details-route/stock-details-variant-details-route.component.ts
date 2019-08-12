import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsItemVariantStock, WsItemVariantStockRef, WsStock} from '@valuya/comptoir-ws-api';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {NavigationService} from '../../navigation.service';
import {map, mergeMap, publishReplay, refCount, switchMap} from 'rxjs/operators';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {StockService} from '../../domain/commercial/stock.service';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-stock-details-variant-details-route',
  templateUrl: './stock-details-variant-details-route.component.html',
  styleUrls: ['./stock-details-variant-details-route.component.scss']
})
export class StockDetailsVariantDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsItemVariantStock>;

  private subscription: Subscription;
  stock$: Observable<WsStock | null>;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private stockService: StockService,
  ) {
  }

  ngOnInit() {
    this.formHelper = new ShellFormHelper<WsItemVariantStock>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
    this.subscription = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'stockVariant')
      .subscribe(stockVariant => this.formHelper.init(stockVariant));

    this.stock$ = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'stock').pipe(
      publishReplay(1), refCount(),
    );
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedStockVariant => this.onSaveSuccess(updatedStockVariant),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving stockVariant`,
        detail: `${error}`
      })
    );
  }

  private onSaveSuccess(updatedStockVariant) {
    this.messageService.add({
      severity: 'success',
      summary: `StockVariant ${updatedStockVariant.id} saved`
    });
    this.navigationService.navigateBackWithRedirectCheck();
  }

  private validate$(value: WsItemVariantStock): Observable<ValidationResult<WsItemVariantStock>> {
    return of(ValidationResultFactory.emptyResults<WsItemVariantStock>());
  }

  private persist$(value: WsItemVariantStock): Observable<WsItemVariantStock> {
    return this.stockService.createStockVariant$(value).pipe(
      switchMap(ref => this.stockService.getStockVariant$(ref))
    );
  }

}
