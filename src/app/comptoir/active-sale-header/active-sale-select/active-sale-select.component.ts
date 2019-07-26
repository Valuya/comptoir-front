import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import {WsCompanyRef, WsSale, WsSaleRef, WsSaleSearch} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../../auth.service';
import {filter, map, publishReplay, refCount, switchMap, take} from 'rxjs/operators';
import {PaginationUtils} from '../../../util/pagination-utils';
import {SaleSelectItem} from '../../../domain/commercial/sale-select/sale-select-item';
import {SaleService} from '../../../domain/commercial/sale.service';

@Component({
  selector: 'cp-active-sale-select',
  templateUrl: './active-sale-select.component.html',
  styleUrls: ['./active-sale-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: ActiveSaleSelectComponent,
    multi: true
  }]
})
export class ActiveSaleSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  valueSource$ = new BehaviorSubject<WsSaleRef | null>(null);
  valueItem$: Observable<SaleSelectItem | null>;

  private onChange: (value: WsSaleRef) => void;
  private onTouched: () => void;

  suggestionQuerySource$ = new Subject<string>();
  suggestionsResults$: Observable<SaleSelectItem[]>;
  loadingSuggestions$ = new BehaviorSubject<boolean>(false);

  constructor(private saleService: SaleService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.valueItem$ = this.valueSource$.pipe(
      switchMap(ref => this.fetchRef$(ref)),
      map(sale => this.createItem(sale)),
      publishReplay(1), refCount()
    );
    this.suggestionsResults$ = this.suggestionQuerySource$.pipe(
      switchMap(searchQuery => this.searchSuggestions$(searchQuery)),
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
    this.valueSource$.next(obj);
  }

  fireChanges(newValue: WsSaleRef) {
    this.valueSource$.next(newValue);
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }

  onSearchQuery(event: { query: string }) {
    this.suggestionQuerySource$.next(event == null ? null : event.query);
  }

  private searchSuggestions$(saearchQuery: string): Observable<SaleSelectItem[]> {
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      filter(ref => ref != null),
      take(1),
      map(companyRef => this.createSearchFilter(companyRef, saearchQuery)),
      switchMap(searchFilter => this.searchSaleRefs$(searchFilter)),
      map(results => results.list),
      switchMap(list => this.searchSales$(list)),
      map(list => [null, ...list]),
      map(list => list.map(item => this.createItem(item))),
    ) as Observable<SaleSelectItem[]>;
  }

  private fetchRef$(ref: WsSaleRef | null): Observable<WsSale | null> {
    if (ref == null) {
      return of(null);
    }
    return this.saleService.getSale$(ref);
  }

  private createItem(sale: WsSale): SaleSelectItem {
    if (sale == null) {
      return {
        label: 'New slae',
        value: null
      };
    }
    return {
      label: `Sale ${sale.id} (${sale.reference}) ${sale.vatExclusiveAmount}`,
      value: {id: sale.id}
    };
  }

  private searchSaleRefs$(searchFilter: WsSaleSearch) {
    this.loadingSuggestions$.next(true);
    return this.saleService.searchSales$(searchFilter, PaginationUtils.create(10));
  }

  private createSearchFilter(companyRef: WsCompanyRef, query: string): WsSaleSearch {
    return {
      companyRef: companyRef as object,
      closed: false,
    };
  }

  private searchSales$(list: WsSaleRef[]) {
    if (list == null || list.length === 0) {
      return [];
    }
    const items$List = list.map(ref => this.fetchRef$(ref));
    return forkJoin(...items$List);
  }


}
