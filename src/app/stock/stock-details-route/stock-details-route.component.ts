import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsStock, WsStockRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap, tap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ApiService} from '../../api.service';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';

@Component({
  selector: 'cp-stocks-details-route',
  templateUrl: './stock-details-route.component.html',
  styleUrls: ['./stock-details-route.component.scss'],

})
export class StockDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsStock>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private apiService: ApiService) {
    this.formHelper = new ShellFormHelper<WsStock>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.data.pipe(
      map(data => data.stock),
    ).subscribe(stock => this.formHelper.init(stock));
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
    this.navigationService.navigateBackWithRedirectCheck();
  }

  private validate$(value: WsStock): Observable<ValidationResult<WsStock>> {
    return of(ValidationResultFactory.emptyResults<WsStock>());
  }

  private persist$(value: WsStock): Observable<WsStock> {
    if (value.id == null) {
      const created$ = this.apiService.api.createStock({
        wsStock: value
      }) as any as Observable<WsStockRef>;
      return created$.pipe(
        mergeMap(ref => this.apiService.api.getStock({
          id: ref.id
        }))
      ) as any as Observable<WsStock>;
    } else {
      const updated$ = this.apiService.api.updateStock({
        id: value.id,
        wsStock: value
      }) as any as Observable<WsStockRef>;
      return updated$.pipe(
        mergeMap(ref => this.apiService.api.getStock({
          id: ref.id
        }))
      ) as any as Observable<WsStock>;
    }
  }
}
