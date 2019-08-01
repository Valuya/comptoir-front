import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {forkJoin, Observable, of} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {
  WsAttributeDefinition,
  WsAttributeDefinitionRef,
  WsAttributeSearch,
  WsAttributeDefinitionSearchResult, WsAttributeValue, WsAttributeValueRef
} from '@valuya/comptoir-ws-api';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {AttributeDefinitionSelectItem} from './attribute-value/attribute-definition-select-item';
import {WsLocaleText} from '../lang/locale-text/ws-locale-text';
import {AttributeSelectItem} from './attribute-value/attribute-select-item';
import {LocaleTextUtils} from '../lang/locale-text/LocaleTextUtils';
import {SearchResult} from '../../app-shell/shell-table/search-result';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {


  private attributeDefinitionCache: CachedResourceClient<WsAttributeDefinitionRef, WsAttributeDefinition>;
  private attributeValueCache: CachedResourceClient<WsAttributeValueRef, WsAttributeValue>;

  constructor(
    private apiService: ApiService
  ) {
    this.attributeDefinitionCache = new CachedResourceClient<WsAttributeDefinitionRef, WsAttributeDefinition>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
    );
    this.attributeValueCache = new CachedResourceClient<WsAttributeValueRef, WsAttributeValue>(
      ref => this.doGetValue$(ref),
      val => this.doPutValue$(val),
      val => this.doCreateValue$(val),
      // ref => this.doDeleteValue$(ref),
    );
  }

  saveAttributeDefinition(attributeDefinition: WsAttributeDefinition): Observable<WsAttributeDefinition> {
    if (attributeDefinition.id == null) {
      return this.attributeDefinitionCache.createResource$(attributeDefinition).pipe(
        switchMap(ref => this.attributeDefinitionCache.getResource$(ref))
      );
    } else {
      return this.attributeDefinitionCache.updateResource$(attributeDefinition).pipe(
        switchMap(ref => this.attributeDefinitionCache.getResource$(ref))
      );
    }
  }

  getAttributeDefinition$(ref: WsAttributeDefinitionRef): Observable<WsAttributeDefinition> {
    return this.attributeDefinitionCache.getResource$(ref);
  }

  searchAttributeDefinitionList$(seachFilter: WsAttributeSearch, pagination: Pagination): Observable<WsAttributeDefinitionSearchResult> {
    return this.apiService.api.findAttributeDefinitions({
      offset: pagination.first,
      length: pagination.rows,
      wsAttributeSearch: seachFilter
    }) as any as Observable<WsAttributeDefinitionSearchResult>;
  }

  saveAttributeValue(attributeValue: WsAttributeValue): Observable<WsAttributeValue> {
    if (attributeValue.id == null) {
      return this.attributeValueCache.createResource$(attributeValue).pipe(
        switchMap(ref => this.attributeValueCache.getResource$(ref))
      );
    } else {
      return this.attributeValueCache.updateResource$(attributeValue).pipe(
        switchMap(ref => this.attributeValueCache.getResource$(ref))
      );
    }
  }

  getAttributeValue$(ref: WsAttributeValueRef): Observable<WsAttributeValue> {
    return this.attributeValueCache.getResource$(ref);
  }


  createDefinitionItems$(refs: WsAttributeDefinitionRef[], locale: string): Observable<AttributeDefinitionSelectItem[]> {
    if (refs == null || locale == null ) {
      return of([]);
    }
    const def$List = refs.map(ref => this.createDefinitionItem$(ref, locale));
    return def$List.length === 0 ? of([]) : forkJoin(def$List);
  }

  createDefinitionItem$(ref: WsAttributeDefinitionRef, locale: string): Observable<AttributeDefinitionSelectItem> {
    return this.getAttributeDefinition$(ref).pipe(
      map(def => this.createDefinitionItem(def)),
      map(item => this.updateDefinitionItemWithLocale(item, locale))
    );
  }


  createValueItems$(refs: WsAttributeValueRef[], locale: string): Observable<AttributeSelectItem[]> {
    const values$List = refs.map(ref => this.getAttributeValue$(ref));
    const valueDefs$ = values$List.length === 0 ? of([]) : forkJoin(values$List);
    return valueDefs$.pipe(
      switchMap(value => this.createItemFromValues$(value, locale)),
      map(items => this.updateItemsWithLocale(items, locale))
    );
  }


  private doGet$(ref: WsAttributeDefinitionRef) {
    return this.apiService.api.getAttributeDefinition({
      id: ref.id
    }) as any as Observable<WsAttributeDefinition>;
  }


  private doPut$(val: WsAttributeDefinition) {
    return this.apiService.api.updateAttributeDefinition({
      id: val.id,
      wsAttributeDefinition: val
    }) as any as Observable<WsAttributeDefinitionRef>;
  }

  private doCreate$(val: WsAttributeDefinition) {
    return this.apiService.api.createAttributeDefinition({
      wsAttributeDefinition: val
    }) as any as Observable<WsAttributeDefinitionRef>;
  }

  // private doDelete$(ref: WsAttributeDefinitionRef) {
  //   return this.apiService.api.remo({
  //     id: ref.id
  //   }) as any as Observable<WsAttributeDefinitionRef>;
  // }


  private doGetValue$(ref: WsAttributeValueRef) {
    return this.apiService.api.getAttributeValue({
      id: ref.id
    }) as any as Observable<WsAttributeValue>;
  }


  private doPutValue$(val: WsAttributeValue) {
    return this.apiService.api.updateAttributeValue({
      id: val.id,
      wsAttributeValue: val
    }) as any as Observable<WsAttributeValueRef>;
  }

  private doCreateValue$(val: WsAttributeValue) {
    return this.apiService.api.createAttributeValue({
      wsAttributeValue: val
    }) as any as Observable<WsAttributeValueRef>;
  }

  // private doDeleteValue$(ref: WsAttributeValueRef) {
  //   return this.apiService.api.remo({
  //     id: ref.id
  //   }) as any as Observable<WsAttributeValueRef>;
  // }
//


  private createDefinitionItem(def: WsAttributeDefinition): AttributeDefinitionSelectItem {
    return {
      definitionNameTexts: def.name as WsLocaleText[],
      definitionRef: {id: def.id},
      definitionLabel: null,
    };
  }

  private updateItemsWithLocale(items: AttributeSelectItem[], locale: string) {
    return items.map(item => {
      return this.updateItemWithLocale(item, locale);
    });
  }


  private updateItemWithLocale(item: AttributeSelectItem, locale: string): AttributeSelectItem {
    const defItemUpdated = this.updateDefinitionItemWithLocale(item, locale);
    const valueText = LocaleTextUtils.findLocalizedText(item.definitionNameTexts, locale, true);
    const defLabel = defItemUpdated.definitionLabel;
    const valueLabelString = valueText == null ? null : valueText.text;
    const labelString = defLabel == null ? null : `${defLabel}: ${valueLabelString}`;
    return Object.assign({}, item, {
      valueLabel: valueLabelString,
      label: labelString
    } as Partial<AttributeSelectItem>);
  }


  private updateDefinitionItemWithLocale<T extends AttributeDefinitionSelectItem>(item: T, locale: string): T {
    const defText = LocaleTextUtils.findLocalizedText(item.definitionNameTexts, locale, true);
    const defLabel = defText == null ? null : defText.text;
    return Object.assign({}, item, {
      definitionLabel: defLabel,
    } as Partial<T>);
  }


  private createItemFromValues$(values: WsAttributeValue[], locale: string) {
    const defRefs = values.map(value => value.attributeDefinitionRef);
    const defItems$ = this.createDefinitionItems$(defRefs as WsAttributeDefinitionRef[], locale);
    return defItems$.pipe(
      map(items => {
        return this.updateItemWithValue(items, values);
      })
    );
  }

  private updateItemWithValue(items: AttributeDefinitionSelectItem[], values: WsAttributeValue[]): AttributeSelectItem[] {
    const itemValues: AttributeSelectItem[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const value = values[i];
      const itemValue = Object.assign({}, item, {
        valueRef: {id: value.id},
        valueTexts: value.value as WsLocaleText[]
      } as Partial<AttributeSelectItem>) as AttributeSelectItem;
      itemValues.push(itemValue);
    }
    return itemValues;
  }
}
