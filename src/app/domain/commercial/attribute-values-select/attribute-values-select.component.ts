import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import {WsAttributeSearch, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {map, publishReplay, refCount, switchMap, take} from 'rxjs/operators';
import {AuthService} from '../../../auth.service';
import {AttributeSelectItem} from '../attribute-value/attribute-select-item';
import {LocaleService} from '../../../locale.service';
import {AttributeService} from '../attribute.service';
import {PaginationUtils} from '../../../util/pagination-utils';

@Component({
  selector: 'cp-attribute-values-select',
  templateUrl: './attribute-values-select.component.html',
  styleUrls: ['./attribute-values-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AttributeValuesSelectComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeValuesSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  valuesSource$ = new BehaviorSubject<AttributeSelectItem[]>([]);
  nextItem: AttributeSelectItem = this.createNextItem();

  private onChange: (value: AttributeSelectItem[]) => void;
  private onTouched: () => void;

  suggestionQuerySource$ = new Subject<string>();
  suggestions$: Observable<AttributeSelectItem[]>;
  loadingSuggestions$ = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private localeService: LocaleService,
    private attributeService: AttributeService,
  ) {
  }

  ngOnInit() {
    this.suggestions$ = this.suggestionQuerySource$.pipe(
      switchMap(searchQuery => this.searchSuggestions$(searchQuery)),
      publishReplay(1), refCount(),
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

  updateNextItem(update: Partial<AttributeSelectItem>) {
    this.nextItem = Object.assign({}, this.nextItem, update);
  }

  fireChanges(newValue: AttributeSelectItem[]) {
    this.valuesSource$.next(newValue);
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }

  private searchSuggestions$(searchQuery: string): Observable<AttributeSelectItem[]> {
    const companyRef$ = this.authService.getLoggedEmployeeCompanyRef$().pipe(take(1));
    return companyRef$.pipe(
      map(companyRef => this.createSuggestionsFilter(companyRef, searchQuery)),
      switchMap(searchFilter => this.searchSuggestionsItems$(searchFilter)),
    );
  }

  private createSuggestionsFilter(companyRef: WsCompanyRef, searchQuery: string): WsAttributeSearch {
    return {
      multiSearch: searchQuery,
      companyRef: companyRef as object
    };
  }

  private searchSuggestionsItems$(searchFilter: WsAttributeSearch): Observable<AttributeSelectItem[]> {
    if (searchFilter == null || searchFilter.companyRef == null) {
      return of([]);
    }
    this.loadingSuggestions$.next(true);
    const definitions$ = this.attributeService.searchAttributeDefinitionList$(searchFilter, PaginationUtils.create(10));
    const locale$ = this.localeService.getViewLocale$().pipe(take(1));

    return forkJoin(definitions$, locale$).pipe(
      switchMap(results => this.attributeService.createDefinitionItems$(results[0].list, results[1])),
      map(list => list.map(item => item as AttributeSelectItem))
    );
  }

  onValuesChanged(values: AttributeSelectItem[]) {
    this.fireChanges(values);
  }

  onAddNextClick() {
    const curItems = this.valuesSource$.getValue();
    const newItems = [...curItems, this.nextItem];
    this.fireChanges(newItems);
    this.nextItem = this.createNextItem();
  }

  onValueRemoved(removedItem: AttributeSelectItem) {
    const curItems = this.valuesSource$.getValue();
    const newItems = curItems.filter(
      i => i !== removedItem
    );
    this.fireChanges(newItems);
    this.nextItem = this.createNextItem();
  }


  private createNextItem(): AttributeSelectItem {
    return {
      definitionNameTexts: [],
      valueTexts: [],
      valueRef: null,
      definitionRef: null,
      definitionLabel: null,
      label: null,
      valueLabel: null
    };
  }

}
