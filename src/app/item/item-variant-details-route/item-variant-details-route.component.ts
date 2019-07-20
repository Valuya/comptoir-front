import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsItemVariant, WsItemVariantRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap, tap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ApiService} from '../../api.service';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';

@Component({
  selector: 'cp-item-variant-details-route',
  templateUrl: './item-variant-details-route.component.html',
  styleUrls: ['./item-variant-details-route.component.scss'],

})
export class ItemVariantDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsItemVariant>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private apiService: ApiService) {
    this.formHelper = new ShellFormHelper<WsItemVariant>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.data.pipe(
      map(data => data.itemVariant),
    ).subscribe(itemVariant => this.formHelper.init(itemVariant));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedItemVariant => this.onSaveSuccess(updatedItemVariant),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving itemVariant`,
        detail: `${error}`
      })
    );
  }

  private onSaveSuccess(updatedItemVariant) {
    this.messageService.add({
      severity: 'success',
      summary: `ItemVariant ${updatedItemVariant.id} saved`
    });
    this.navigationService.navigateBackWithRedirectCheck();
  }

  private validate$(value: WsItemVariant): Observable<ValidationResult<WsItemVariant>> {
    return of(ValidationResultFactory.emptyResults<WsItemVariant>());
  }

  private persist$(value: WsItemVariant): Observable<WsItemVariant> {
    if (value.id == null) {
      const created$ = this.apiService.api.createItemVariant({
        wsItemVariant: value,
      }) as any as Observable<WsItemVariantRef>;
      return created$.pipe(
        mergeMap(ref => this.apiService.api.getItemVariant({
          id: ref.id
        }))
      ) as any as Observable<WsItemVariant>;
    } else {
      const updated$ = this.apiService.api.updateItemVariant({
        id: value.id,
        wsItemVariant: value,
      }) as any as Observable<WsItemVariantRef>;
      return updated$.pipe(
        mergeMap(ref => this.apiService.api.getItemVariant({
          id: ref.id
        }))
      ) as any as Observable<WsItemVariant>;
    }
  }
}
