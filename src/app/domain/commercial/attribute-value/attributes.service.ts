import {Injectable} from '@angular/core';
import {WsAttributeDefinition, WsAttributeDefinitionRef, WsAttributeValue, WsAttributeValueRef} from '@valuya/comptoir-ws-api';
import {forkJoin, Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {WsLocaleText} from '../../lang/locale-text/ws-locale-text';
import {AttributeSelectItem} from './attribute-select-item';
import {ApiService} from '../../../api.service';
import {AttributeDefinitionSelectItem} from './attribute-definition-select-item';
import {LocaleTextUtils} from '../../lang/locale-text/LocaleTextUtils';

@Injectable({
  providedIn: 'root'
})
export class AttributesService {

  constructor(
    private apiService: ApiService,
  ) {
  }

  createDefinitionItems$(refs: WsAttributeDefinitionRef[], locale: string): Observable<AttributeDefinitionSelectItem[]> {
    const def$List = refs.map(ref => this.createDefinitionItem$(ref, locale));
    return def$List.length === 0 ? of([]) : forkJoin(def$List);
  }

  createDefinitionItem$(ref: WsAttributeDefinitionRef, locale: string): Observable<AttributeDefinitionSelectItem> {
    return this.fetchDefinition$(ref).pipe(
      map(def => this.createDefinitionItem(def)),
      map(item => this.updateDefinitionItemWithLocale(item, locale))
    );
  }

  private fetchDefinition$(ref: WsAttributeDefinitionRef) {
    return this.apiService.api.getAttributeDefinition({
      id: ref.id,
    }) as any as Observable<WsAttributeDefinition>;
  }

  createValueItems$(refs: WsAttributeValueRef[], locale: string): Observable<AttributeSelectItem[]> {
    return this.findValues$(refs).pipe(
      switchMap(values => this.createItemFromValues$(values, locale)),
      map(items => this.updateItemsWithLocale(items, locale))
    );
  }


  private createItemFromValues$(values: WsAttributeValue[], locale: string) {
    const defRefs = values.map(value => value.attributeDefinitionRef);
    const defItems$ = this.createDefinitionItems$(defRefs, locale);
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

  private createDefinitionItem(def: WsAttributeDefinition): AttributeDefinitionSelectItem {
    return {
      definitionNameTexts: def.name as WsLocaleText[],
      definitionRef: {id: def.id},
      definitionLabel: null,
    };
  }


  private findValues$(refs: WsAttributeValueRef[]): Observable<WsAttributeValue[]> {
    const value$List = refs.map(ref => this.apiService.api.getAttributeValue({
      id: ref.id
    }) as any as Observable<WsAttributeValue>);
    const results$ = value$List.length === 0 ? of([]) : forkJoin(value$List);
    return results$;
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
}
