import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WsCompanyRef, WsCustomer, WsCustomerRef, WsCustomerSearch, WsCustomerSearchResult} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import {CustomerSelectItem} from './customer-select-item';
import {filter, map, publishReplay, refCount, switchMap, take} from 'rxjs/operators';
import {AuthService} from '../../../auth.service';
import {CustomerService} from '../customer.service';
import {PaginationUtils} from '../../../util/pagination-utils';

@Component({
  selector: 'cp-customer-select',
  templateUrl: './customer-select.component.html',
  styleUrls: ['./customer-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CustomerSelectComponent,
    multi: true
  }]
})
export class CustomerSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  valueSource$ = new BehaviorSubject<WsCustomerRef | null>(null);
  valueItem$: Observable<CustomerSelectItem | null>;

  private onChange: (value: WsCustomerRef) => void;
  private onTouched: () => void;

  suggestionQuerySource$ = new Subject<string>();
  suggestions$: Observable<CustomerSelectItem[]>;
  loadingSuggestions$ = new BehaviorSubject<boolean>(false);

  constructor(private customreService: CustomerService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.valueItem$ = this.valueSource$.pipe(
      switchMap(ref => this.fetchRef$(ref)),
      map(customer => this.createItem(customer)),
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

  fireChanges(newValue: WsCustomerRef) {
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
      switchMap(searchFilter => this.searchCustomerRefs$(searchFilter)),
      map(results => results.list),
      switchMap(list => this.searchCustomers$(list)),
      map(list => saearchQuery == null ? [null, ...list] : list),
      map(list => list.map(item => this.createItem(item)))
    );
  }

  private fetchRef$(ref: WsCustomerRef | null): Observable<WsCustomer | null> {
    if (ref == null) {
      return of(null);
    }
    return this.customreService.getCustomer$(ref);
  }

  private createItem(customer: WsCustomer): CustomerSelectItem {
    if (customer == null) {
      return {
        label: 'Aucun',
        ref: null
      };
    }
    return {
      label: `${customer.lastName} ${customer.firstName}`,
      ref: {
        id: customer.id,
      }
    };
  }

  private searchCustomerRefs$(searchFilter: WsCustomerSearch) {
    this.loadingSuggestions$.next(true);
    return this.customreService.searchCustomerList$(searchFilter, PaginationUtils.create(10));
  }

  private createSearchFilter(companyRef: WsCompanyRef, query: string): WsCustomerSearch {
    return {
      companyRef: companyRef as object,
      multiSearch: query
    };
  }

  private searchCustomers$(list: WsCustomerRef[]) {
    if (list == null || list.length === 0) {
      return [];
    }
    const items$List = list.map(ref => this.fetchRef$(ref));
    return forkJoin(...items$List);
  }

}
