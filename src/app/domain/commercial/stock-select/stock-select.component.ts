import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WsCompanyRef, WsStock, WsStockRef, WsStockSearch, WsStockSearchResult} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import {StockSelectItem} from './stock-select-item';
import {filter, map, publishReplay, refCount, switchMap, take} from 'rxjs/operators';
import {ApiService} from '../../../api.service';
import {AuthService} from '../../../auth.service';
import {LocaleService} from '../../../locale.service';
import {WsLocaleText} from '../../lang/locale-text/ws-locale-text';
import {StockService} from '../stock.service';
import {PaginationUtils} from '../../../util/pagination-utils';

@Component({
  selector: 'cp-stock-select',
  templateUrl: './stock-select.component.html',
  styleUrls: ['./stock-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: StockSelectComponent,
    multi: true
  }]
})
export class StockSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  valueSource$ = new BehaviorSubject<WsStockRef | null>(null);
  valueItem$: Observable<StockSelectItem | null>;

  private onChange: (value: WsStockRef) => void;
  private onTouched: () => void;

  suggestionQuerySource$ = new Subject<string>();
  suggestions$: Observable<StockSelectItem[]>;
  loadingSuggestions$ = new BehaviorSubject<boolean>(false);

  constructor(private stockService: StockService,
              private localeService: LocaleService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.valueItem$ = this.valueSource$.pipe(
      switchMap(ref => this.fetchRef$(ref)),
      switchMap(stock => this.createItem$(stock)),
      publishReplay(1), refCount()
    );
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
    this.valueSource$.next(obj);
  }

  fireChanges(newValue: WsStockRef) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }

  onSearchQuery(event: { query: string }) {
    this.suggestionQuerySource$.next(event.query);
  }

  private searchSuggestions$(saearchQuery: string) {
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      filter(ref => ref != null),
      take(1),
      map(companyRef => this.createSearchFilter(companyRef, saearchQuery)),
      switchMap(searchFilter => this.searchStockRefs$(searchFilter)),
      map(results => results.list),
      switchMap(list => this.searchStocks$(list)),
      map(list => saearchQuery == null ? [null, ...list] : list),
      switchMap(list => this.createAllItems$(list))
    );
  }

  private fetchRef$(ref: WsStockRef | null): Observable<WsStock | null> {
    if (ref == null) {
      return of(null);
    }
    return this.stockService.getStock$(ref);
  }

  private createItem$(stock: WsStock): Observable<StockSelectItem> {
    if (stock == null) {
      return of({
        label: 'Aucun',
        ref: null
      });
    }
    return this.localeService.getLocalizedText(stock.description as WsLocaleText[]).pipe(
      map(labelValue => {
        return {
          label: labelValue,
          ref: {
            id: stock.id,
          }
        };
      })
    );
  }

  private searchStockRefs$(searchFilter: WsStockSearch) {
    this.loadingSuggestions$.next(true);
    return this.stockService.searchStockList$(searchFilter, PaginationUtils.create(10));
  }

  private createSearchFilter(companyRef: WsCompanyRef, query: string): WsStockSearch {
    return {
      companyRef: companyRef as object,
    };
  }

  private searchStocks$(list: WsStockRef[]) {
    if (list == null || list.length === 0) {
      return [];
    }
    const items$List = list.map(ref => this.fetchRef$(ref));
    return forkJoin(...items$List);
  }

  private createAllItems$(list: WsStock[]) {
    const items$List = list.map(item => this.createItem$(item));
    return items$List.length === 0 ? of([]) : forkJoin(items$List);
  }
}
