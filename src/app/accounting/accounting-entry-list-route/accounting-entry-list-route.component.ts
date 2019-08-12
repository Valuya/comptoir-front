import {Component, OnDestroy, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {BehaviorSubject, concat, Observable, of, Subscription} from 'rxjs';
import {TableColumn} from '../../util/table-column';
import {MenuItem, MessageService} from 'primeng/api';
import {AccountingEntryColumn, AccountingEntryColumns} from '../accounting-entry-column/accounting-entry-columns';
import {map, mergeMap, publishReplay, refCount, tap, toArray} from 'rxjs/operators';
import {Pagination} from '../../util/pagination';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {WsAccountingEntry, WsAccountingEntryRef, WsAccountingEntrySearch} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountingService} from '../../domain/accounting/accounting.service';
import {AccountingEntrySearchFilterSerializer} from '../accounting-entry-search-filter-serializer';

@Component({
  selector: 'cp-accounting-entry-list-route',
  templateUrl: './accounting-entry-list-route.component.html',
  styleUrls: ['./accounting-entry-list-route.component.scss']
})
export class AccountingEntryListRouteComponent implements OnInit, OnDestroy {


  accountingEntrysTableHelper: ShellTableHelper<WsAccountingEntry, WsAccountingEntrySearch>;
  selectedAccountingEntrys$ = new BehaviorSubject<WsAccountingEntry[]>([]);
  columns: TableColumn<AccountingEntryColumn>[] = [
    AccountingEntryColumns.ID,
    AccountingEntryColumns.DATETIME,
    AccountingEntryColumns.ACCOUNT,
    AccountingEntryColumns.AMOUNT,
    AccountingEntryColumns.VAT_RATE,
    AccountingEntryColumns.CUSTOMER,
    AccountingEntryColumns.TRANSACTION,
    AccountingEntryColumns.VAT_ENTRY,
    AccountingEntryColumns.DESCRIPTION,
  ];

  selectionMenu$: Observable<MenuItem[]>;
  selectionLabel$: Observable<string | null>;

  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private accountingService: AccountingService,
  ) {
  }

  ngOnInit() {
    this.accountingEntrysTableHelper = new ShellTableHelper<WsAccountingEntry, WsAccountingEntrySearch>(
      (searchFilter, pagination) => this.searchAccountingEntrys$(searchFilter, pagination)
    );
    this.selectionMenu$ = this.selectedAccountingEntrys$.pipe(
      map(accountingEntrys => this.createMenu(accountingEntrys)),
      publishReplay(1), refCount()
    );
    this.selectionLabel$ = this.selectedAccountingEntrys$.pipe(
      map(s => s == null || s.length === 0 ? '' : `${s.length} accountingEntrys selected`)
    );

    this.subscription = this.activatedRoute.data.pipe(
      map(data => data.accountingEntrySearchFilter),
    ).subscribe(searchFilter => this.accountingEntrysTableHelper.setFilter(searchFilter));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  onRowSelect(accountingEntry: WsAccountingEntry) {
    this.router.navigate(['/accounting/entry/', accountingEntry.id]);
  }

  onSelectionChange$(accountingEntrys: WsAccountingEntry[]) {
    this.selectedAccountingEntrys$.next(accountingEntrys);
  }

  onFilterChange(searchFilter: WsAccountingEntrySearch) {
    const queryParamsFilter = AccountingEntrySearchFilterSerializer.serializeFilter(searchFilter);
    this.router.navigate(['.'], {
      queryParams: queryParamsFilter,
      relativeTo: this.activatedRoute,
    });
  }

  private searchAccountingEntrys$(searchFilter: WsAccountingEntrySearch | null, pagination: Pagination | null): Observable<SearchResult<WsAccountingEntry>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.accountingService.searchEntries$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultAccountingEntrys$(results)),
    );
  }

  private searchResultAccountingEntrys$(results: SearchResult<WsAccountingEntryRef>): Observable<SearchResult<WsAccountingEntry>> {
    const accountingEntrys$List = results.list.map(ref => this.accountingService.getEntry$(ref));
    return concat(...accountingEntrys$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsAccountingEntry>;
      })
    );
  }

  private createMenu(selection: WsAccountingEntry[]): MenuItem[] {
    return [];
  }

}
