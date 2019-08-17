import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsStock} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {NavigationService} from '../../navigation.service';
import {StockService} from '../../domain/commercial/stock.service';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-stock-details-form-route',
  templateUrl: './stock-details-form-route.component.html',
  styleUrls: ['./stock-details-form-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockDetailsFormRouteComponent implements OnInit, OnDestroy {
  formHelper: ShellFormHelper<WsStock>;
  private subscription: Subscription;

  constructor(
    private stockService: StockService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private navigationService: NavigationService,
  ) {
  }

  ngOnInit() {

    this.formHelper = new ShellFormHelper<WsStock>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
    this.subscription = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'stock')
      .subscribe(stock => this.formHelper.init(stock));

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedStock => this.onSaveSuccess(updatedStock),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving stock`,
        detail: `${error}`
      })
    );
  }


  private onSaveSuccess(updatedStock) {
    this.messageService.add({
      severity: 'success',
      summary: `Stock ${updatedStock.id} saved`
    });
    this.navigationService.navigateBackOrToParentWithRedirectCheck();
  }

  private validate$(value: WsStock): Observable<ValidationResult<WsStock>> {
    return of(ValidationResultFactory.emptyResults<WsStock>());
  }

  private persist$(value: WsStock): Observable<WsStock> {
    return this.stockService.saveStock(value).pipe(
      switchMap(ref => this.stockService.getStock$(ref))
    );
  }

}
