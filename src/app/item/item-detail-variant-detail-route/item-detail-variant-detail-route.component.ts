import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellFormHelper} from '../../app-shell/shell-details-form/shell-form-helper';
import {
  WsAttributeDefinition,
  WsAttributeDefinitionRef, WsAttributeValue,
  WsAttributeValueRef,
  WsItem,
  WsItemVariant,
  WsItemVariantRef
} from '@valuya/comptoir-ws-api';
import {combineLatest, forkJoin, Observable, of, Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {NavigationService} from '../../navigation.service';
import {map, mergeMap, publishReplay, refCount, switchMap, take, tap} from 'rxjs/operators';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {ValidationResultFactory} from '../../app-shell/shell-details-form/validation-result.factory';
import {AttributeSelectItem} from '../../domain/commercial/attribute-value/attribute-select-item';
import {AuthService} from '../../auth.service';
import {LocaleTextUtils} from '../../domain/lang/locale-text/LocaleTextUtils';
import {ItemService} from '../../domain/commercial/item.service';
import {AttributeService} from '../../domain/commercial/attribute.service';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-item-detail-variant-detail-route',
  templateUrl: './item-detail-variant-detail-route.component.html',
  styleUrls: ['./item-detail-variant-detail-route.component.scss']
})
export class ItemDetailVariantDetailRouteComponent implements OnInit, OnDestroy {

  formHelper: ShellFormHelper<WsItemVariant>;

  item$: Observable<WsItem | null>;

  private editedAttributes: AttributeSelectItem[];
  private subscription: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private messageService: MessageService,
              private navigationService: NavigationService,
              private itemService: ItemService,
              private attributeService: AttributeService,
  ) {
  }

  ngOnInit() {
    this.formHelper = new ShellFormHelper<WsItemVariant>(
      value => this.validate$(value),
      value => this.persist$(value),
    );
    this.subscription = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'itemVariant')
      .subscribe(itemVariant => this.formHelper.init(itemVariant));

    this.item$ = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'item').pipe(
      publishReplay(1), refCount(),
    ) as any as Observable<WsItem>;
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onFormSubmit() {
    return this.saveAttributes$().pipe(
      tap(valueRefs => {
        this.formHelper.update({
          attributeValueRefs: valueRefs.map(ref => {
            return {id: ref.id} as WsAttributeValueRef;
          })
        });
      }),
      switchMap(() => this.formHelper.persist$()),
    ).subscribe(
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
    return this.itemService.saveVariant(value).pipe(
      switchMap(ref => this.itemService.getItemVariant$(ref))
    );
  }

  onAttributesChange(attributes: AttributeSelectItem[]) {
    this.editedAttributes = attributes;
  }

  private saveAttributes$(): Observable<WsAttributeValueRef[]> {
    if (this.editedAttributes == null || this.editedAttributes.length === 0) {
      return of([]);
    }
    const attributeSaved$List = this.editedAttributes
      .map(item => this.saveAttributeValue$(item));
    return forkJoin(attributeSaved$List);
  }

  private saveAttributeValue$(item: AttributeSelectItem): Observable<WsAttributeValueRef> {
    if (item.valueRef != null) {
      return of(item.valueRef);
    }
    const definitionRef$ = item.definitionRef == null ? this.saveDefinition$(item) : of(item.definitionRef);
    return definitionRef$.pipe(
      switchMap(defRef => this.createAttributeValue$(defRef, item))
    );
  }

  private saveDefinition$(item: AttributeSelectItem): Observable<WsAttributeDefinitionRef> {
    const definitionNames = LocaleTextUtils.filterValidTexts(item.definitionNameTexts);
    const companyRef$ = this.authService.getLoggedEmployeeCompanyRef$().pipe(take(1));
    return companyRef$.pipe(
      map(companyRefValue => {
        const wsDefinition: WsAttributeDefinition = {
          name: definitionNames,
          companyRef: companyRefValue
        };
        return wsDefinition;
      }),
      switchMap(definition => this.createDefinition$(definition))
    );
  }

  private createDefinition$(definition: WsAttributeDefinition): Observable<WsAttributeDefinitionRef> {
    return this.attributeService.saveAttributeDefinition(definition);
  }

  private createAttributeValue$(defRef: WsAttributeDefinitionRef, item: AttributeSelectItem): Observable<WsAttributeValueRef> {
    const companyRef$ = this.authService.getLoggedEmployeeCompanyRef$().pipe(take(1));
    const validValueTexts = LocaleTextUtils.filterValidTexts(item.valueTexts);
    return companyRef$.pipe(
      map(companyRefValue => {
        const wsValue: WsAttributeValue = {
          attributeDefinitionRef: {id: defRef.id},
          value: validValueTexts
        };
        return wsValue;
      }),
      switchMap(value => this.createValue$(value))
    );
  }

  private createValue$(value: WsAttributeValue): Observable<WsAttributeValueRef> {
    return this.attributeService.saveAttributeValue(value);
  }
}
