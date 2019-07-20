import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {WsItem, WsItemVariant, WsItemVariantRef} from '@valuya/comptoir-ws-api';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {NavigationService} from '../../navigation.service';
import {ApiService} from '../../api.service';
import {map, mergeMap, publishReplay, refCount} from 'rxjs/operators';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';

@Component({
  selector: 'cp-item-detail-variant-detail-route',
  templateUrl: './item-detail-variant-detail-route.component.html',
  styleUrls: ['./item-detail-variant-detail-route.component.scss']
})
export class ItemDetailVariantDetailRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsItemVariant>;

  private subscription: Subscription;
  item$: Observable<WsItem | null>;

  constructor(private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private apiService: ApiService) {
  }

  ngOnInit() {
    this.formHelper = new ShellFormHelper<WsItemVariant>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
    this.subscription = this.activatedRoute.data.pipe(
      map(data => data.itemVariant),
    ).subscribe(itemVariant => this.formHelper.init(itemVariant));

    const item$List = this.activatedRoute.pathFromRoot.map(
      route => route.data.pipe(map(data => data.item))
    );
    this.item$ = combineLatest(...item$List).pipe(
      map(list => list.find(item => item != null)),
      publishReplay(1), refCount(),
    );
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
