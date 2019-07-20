import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsItem, WsItemRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {map, mergeMap, tap} from 'rxjs/operators';
import {MessageService} from 'primeng/api';
import {ApiService} from '../../api.service';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {NavigationService} from '../../navigation.service';

@Component({
  selector: 'cp-item-details-route',
  templateUrl: './item-details-route.component.html',
  styleUrls: ['./item-details-route.component.scss'],

})
export class ItemDetailsRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsItem>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private apiService: ApiService) {
    this.formHelper = new ShellFormHelper<WsItem>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
  }

  ngOnInit() {
    this.subscription = this.activatedRoute.data.pipe(
      map(data => data.item),
    ).subscribe(item => this.formHelper.init(item));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    this.formHelper.persist$().subscribe(
      updatedItem => this.onSaveSuccess(updatedItem),
      error => this.messageService.add({
        severity: 'error',
        summary: `Error while saving item`,
        detail: `${error}`
      })
    );
  }

  private onSaveSuccess(updatedItem) {
    this.messageService.add({
      severity: 'success',
      summary: `Item ${updatedItem.id} saved`
    });
    this.navigationService.navigateBackWithRedirectCheck();
  }

  private validate$(value: WsItem): Observable<ValidationResult<WsItem>> {
    return of(ValidationResultFactory.emptyResults<WsItem>());
  }

  private persist$(value: WsItem): Observable<WsItem> {
    if (value.id == null) {
      const created$ = this.apiService.api.createItem({
        wsItem: value,
      }) as any as Observable<WsItemRef>;
      return created$.pipe(
        mergeMap(ref => this.apiService.api.getItem({
          id: ref.id
        }))
      ) as any as Observable<WsItem>;
    } else {
      const updated$ = this.apiService.api.updateItem({
        id: value.id,
        wsItem: value,
      }) as any as Observable<WsItemRef>;
      return updated$.pipe(
        mergeMap(ref => this.apiService.api.getItem({
          id: ref.id
        }))
      ) as any as Observable<WsItem>;
    }
  }
}
