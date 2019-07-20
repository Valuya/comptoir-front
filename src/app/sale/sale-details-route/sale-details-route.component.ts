import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsSale, WsSaleRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap, tap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ApiService} from '../../api.service';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';

@Component({
  selector: 'cp-sales-details-route',
  templateUrl: './sale-details-route.component.html',
  styleUrls: ['./sale-details-route.component.scss'],

})
export class SaleDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsSale>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private apiService: ApiService) {
    this.formHelper = new ShellFormHelper<WsSale>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.data.pipe(
      map(data => data.sale),
    ).subscribe(sale => this.formHelper.init(sale));
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
    this.navigationService.navigateBackWithRedirectCheck();
  }

  private validate$(value: WsSale): Observable<ValidationResult<WsSale>> {
    return of(ValidationResultFactory.emptyResults<WsSale>());
  }

  private persist$(value: WsSale): Observable<WsSale> {
    if (value.id == null) {
      const created$ = this.apiService.api.createSale({
        wsSale: value
      }) as any as Observable<WsSaleRef>;
      return created$.pipe(
        mergeMap(ref => this.apiService.api.getSale({
          id: ref.id
        }))
      ) as any as Observable<WsSale>;
    } else {
      const updated$ = this.apiService.api.updateSale({
        id: value.id,
        wsSale: value
      }) as any as Observable<WsSaleRef>;
      return updated$.pipe(
        mergeMap(ref => this.apiService.api.getSale({
          id: ref.id
        }))
      ) as any as Observable<WsSale>;
    }
  }
}
