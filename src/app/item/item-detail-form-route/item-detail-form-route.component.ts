import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsItem, WsItemRef} from '@valuya/comptoir-ws-api';
import {Observable, of, Subscription} from 'rxjs';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {NavigationService} from '../../navigation.service';
import {ItemService} from '../../domain/commercial/item.service';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-item-detail-form-route',
  templateUrl: './item-detail-form-route.component.html',
  styleUrls: ['./item-detail-form-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailFormRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsItem>;

  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private itemService: ItemService,
  ) {

  }

  ngOnInit() {
    this.formHelper = new ShellFormHelper<WsItem>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
    this.subscription = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'item')
      .subscribe(item => this.formHelper.init(item as WsItem));
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
    this.navigationService.navigateBackOrToParentWithRedirectCheck();
  }

  private validate$(value: WsItem): Observable<ValidationResult<WsItem>> {
    return of(ValidationResultFactory.emptyResults<WsItem>());
  }

  private persist$(value: WsItem): Observable<WsItem> {
    return this.itemService.saveItem(value).pipe(
      switchMap(ref => this.itemService.getItem$(ref))
    );
  }
}
