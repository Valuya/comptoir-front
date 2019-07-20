import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsSale, WsSaleRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {map, mergeMap} from 'rxjs/operators';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {ApiService} from '../../api.service';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {NavigationService} from '../../navigation.service';

@Component({
  selector: 'cp-sale-details-form-route',
  templateUrl: './sale-details-form-route.component.html',
  styleUrls: ['./sale-details-form-route.component.scss']
})
export class SaleDetailsFormRouteComponent implements OnInit, OnDestroy {
  formHelper: ShellFormHelper<WsSale>;
  private subscription: Subscription;

  constructor(
    private apiService: ApiService,
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
