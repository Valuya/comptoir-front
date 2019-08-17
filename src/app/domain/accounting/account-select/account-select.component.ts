import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, forkJoin, Observable, of, Subject} from 'rxjs';
import {WsAccount, WsAccountRef, WsAccountSearch, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../../auth.service';
import {filter, map, publishReplay, refCount, switchMap, take} from 'rxjs/operators';
import {AccountSelectItem} from './account-select-item';
import {AccountService} from '../account.service';
import {PaginationUtils} from '../../../util/pagination-utils';

@Component({
  selector: 'cp-account-select',
  templateUrl: './account-select.component.html',
  styleUrls: ['./account-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AccountSelectComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {
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
    return this.authService.getNextNonNullLoggedEmployeeCompanyRef$().pipe(
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
    return this.accountService.getAccount$(ref);
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
    return this.accountService.searchAccountList$(searchFilter, PaginationUtils.create(10));
  }

  private createSearchFilter(companyRef: WsCompanyRef, query: string): WsAccountSearch {
    if (query == null || query.length == null || query.length < 3) {
      query = null;
    }
    return {
      companyRef: companyRef as object,
      multiSearch: query,
    };
  }

  private searchAccounts$(list: WsAccountRef[]) {
    if (list == null || list.length === 0) {
      return of([]);
    }
    const items$List = list.map(ref => this.fetchRef$(ref));
    return forkJoin(...items$List);
  }
}
