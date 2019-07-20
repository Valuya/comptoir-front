import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsItem, WsItemRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {map, mergeMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {NavigationService} from '../../navigation.service';
import {ApiService} from '../../api.service';

@Component({
  selector: 'cp-item-detail-form-route',
  templateUrl: './item-detail-form-route.component.html',
  styleUrls: ['./item-detail-form-route.component.scss']
})
export class ItemDetailFormRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsItem>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private apiService: ApiService) {

  }
  ngOnInit() {
    this.formHelper = new ShellFormHelper<WsItem>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
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
