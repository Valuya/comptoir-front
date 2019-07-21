import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import {ApiService} from '../../../api.service';
import {AuthService} from '../../../auth.service';
import {AttributesService} from '../attribute-value/attributes.service';
import {delay, map, publishReplay, refCount, switchMap, take} from 'rxjs/operators';
import {WsAttributeDefinitionSearchResult, WsAttributeSearch, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {LocaleService} from '../../../locale.service';
import {AttributeDefinitionSelectItem} from '../attribute-value/attribute-definition-select-item';
import {WsLocaleText} from '../../lang/locale-text/ws-locale-text';

@Component({
  selector: 'cp-attribute-definition-select',
  templateUrl: './attribute-definition-select.component.html',
  styleUrls: ['./attribute-definition-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AttributeDefinitionSelectComponent,
    multi: true
  }]
})
export class AttributeDefinitionSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;
  @Input()
  required: boolean;

  valuesSource$ = new BehaviorSubject<AttributeDefinitionSelectItem | null>(null);
  value$: Observable<AttributeDefinitionSelectItem | null>;

  private onChange: (value: AttributeDefinitionSelectItem) => void;
  private onTouched: () => void;

  suggestionQuerySource$ = new Subject<string>();
  suggestions$: Observable<AttributeDefinitionSelectItem[]>;
  loadingSuggestions$ = new BehaviorSubject<boolean>(false);

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private localeService: LocaleService,
    private attributeService: AttributesService,
  ) {
  }

  ngOnInit() {
    this.suggestions$ = this.suggestionQuerySource$.pipe(
      switchMap(searchQuery => this.searchSuggestions$(searchQuery)),
      publishReplay(1), refCount(),
    );
    this.value$ = this.valuesSource$.pipe(
      delay(0),
      switchMap(source => this.fetchSource$(source)),
      publishReplay(1), refCount()
    );
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.valuesSource$.next(obj);
  }

  fireChanges(newValue: AttributeDefinitionSelectItem) {
    this.valuesSource$.next(newValue);
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }

  onSearchQuery(query: string) {
    this.suggestionQuerySource$.next(query);
  }

  private searchSuggestions$(searchQuery: string): Observable<AttributeDefinitionSelectItem[]> {
    const companyRef$ = this.authService.getLoggedEmployeeCompanyRef$().pipe(take(1));
    const locale$ = this.localeService.getViewLocale$().pipe(take(1));
    return forkJoin(companyRef$, locale$).pipe(
      map(results => this.createSuggestionsFilter(results[0], results[1], searchQuery)),
      switchMap(searchFilter => this.searchSuggestionsItems$(searchFilter)),
      switchMap(items => this.prependSearchQueryItem$(items, searchQuery)),
    );
  }

  private createSuggestionsFilter(companyRef: WsCompanyRef, locale: string, searchQuery: string): WsAttributeSearch {
    return {
      nameContains: searchQuery,
      locale: locale as any as object,
      companyRef: companyRef as object
    };
  }

  private searchSuggestionsItems$(searchFilter: WsAttributeSearch): Observable<AttributeDefinitionSelectItem[]> {
    if (searchFilter == null || searchFilter.companyRef == null) {
      return of([]);
    }
    this.loadingSuggestions$.next(true);
    const definitions$ = this.apiService.api.findAttributeDefinitions({
      offset: 0,
      length: 10,
      wsAttributeSearch: searchFilter
    }) as any as Observable<WsAttributeDefinitionSearchResult>;
    const locale$ = this.localeService.getViewLocale$().pipe(take(1));
    return forkJoin(definitions$, locale$).pipe(
      switchMap(results => this.attributeService.createDefinitionItems$(results[0].list, results[1]))
    );
  }

  onValuesChanged(value: AttributeDefinitionSelectItem) {
    this.fireChanges(value);
  }

  private fetchSource$(source: AttributeDefinitionSelectItem): Observable<AttributeDefinitionSelectItem> {
    if (source == null || source.definitionRef == null) {
      return of(source);
    }
    const locale$ = this.localeService.getViewLocale$().pipe(take(1));
    return locale$.pipe(
      switchMap(locale => this.attributeService.createDefinitionItem$(source.definitionRef, locale)),
    );
  }

  private prependSearchQueryItem$(items: AttributeDefinitionSelectItem[], queryString: string) {
    const queiedItemExists = items.find(i => i.definitionLabel === queryString) != null;
    if (queiedItemExists) {
      return of(items);
    }

    return this.localeService.getViewLocale$().pipe(
      map(localeValue => {
        const texts: WsLocaleText[] = [{
          locale: localeValue,
          text: queryString
        }];
        const newItem: AttributeDefinitionSelectItem = {
          definitionLabel: queryString,
          definitionNameTexts: texts,
          definitionRef: null
        };
        return [newItem, ...items];
      })
    );

  }
}
