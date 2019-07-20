import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import {WsCompanyRef, WsAccount, WsAccountRef, WsAccountSearch, WsAccountSearchResult} from '@valuya/comptoir-ws-api';
import {ApiService} from '../../../api.service';
import {AuthService} from '../../../auth.service';
import {filter, map, publishReplay, refCount, switchMap, take} from 'rxjs/operators';
import {AccountSelectItem} from './account-select-item';

@Component({
  selector: 'cp-account-select',
  templateUrl: './account-select.component.html',
  styleUrls: ['./account-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AccountSelectComponent,
    multi: true
  }]
})
export class AccountSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  valueSource$ = new BehaviorSubject<WsAccountRef | null>(null);
  valueItem$: Observable<AccountSelectItem | null>;

  private onChange: (value: WsAccountRef) => void;
  private onTouched: () => void;

  suggestionQuerySource$ = new Subject<string>();
  suggestions$: Observable<AccountSelectItem[]>;
  loadingSuggestions$ = new BehaviorSubject<boolean>(false);

  constructor(private apiService: ApiService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.valueItem$ = this.valueSource$.pipe(
      switchMap(ref => this.fetchRef$(ref)),
      map(account => this.createItem(account)),
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

  fireChanges(newValue: WsAccountRef) {
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
      switchMap(searchFilter => this.searchAccountRefs$(searchFilter)),
      map(results => results.list),
      switchMap(list => this.searchAccounts$(list)),
      map(list => list.map(item => this.createItem(item)))
    );
  }

  private fetchRef$(ref: WsAccountRef | null): Observable<WsAccount | null> {
    if (ref == null) {
      return of(null);
    }
    const fetched$ = this.apiService.api.getAccount({
      id: ref.id,
    }) as any as Observable<WsAccount>;
    return fetched$;
  }

  private createItem(account: WsAccount): AccountSelectItem {
    if (account == null) {
      return {
        label: 'Aucun',
        ref: null
      };
    }
    return {
      label: `${account.accountingNumber} ${account.name}`,
      ref: {
        id: account.id,
      }
    };
  }

  private searchAccountRefs$(searchFilter: WsAccountSearch) {
    this.loadingSuggestions$.next(true);
    const loaded$ = this.apiService.api.searchAccounts({
      offset: 0,
      length: 10,
      wsAccountSearch: searchFilter
    }) as any as Observable<WsAccountSearchResult>;
    return loaded$;
  }

  private createSearchFilter(companyRef: WsCompanyRef, query: string): WsAccountSearch {
    return {
      companyRef: companyRef as object,
      multiSearch: query
    };
  }

  private searchAccounts$(list: WsAccountRef[]) {
    if (list == null || list.length === 0) {
      return [];
    }
    const items$List = list.map(ref => this.fetchRef$(ref));
    return forkJoin(...items$List);
  }
}
