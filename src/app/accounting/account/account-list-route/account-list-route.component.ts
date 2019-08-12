import {Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../../util/pagination';
import {SearchResultFactory} from '../../../app-shell/shell-table/search-result.factory';
import {concat, Observable, of} from 'rxjs';
import {filter, map, mergeMap, take, toArray} from 'rxjs/operators';
import {TableColumn} from '../../../util/table-column';
import {SearchResult} from '../../../app-shell/shell-table/search-result';
import {WsAccount, WsAccountSearch, WsAccountSearchResult, WsEmployee} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../../auth.service';
import {Router} from '@angular/router';
import {AccountService} from '../../../domain/accounting/account.service';
import {
  ACCOUNT_TYPE_COLUMN,
  AccountColumn,
  ACCOUNTING_NUMBER_COLUMN,
  CASH_COLUMN, DESCRIPTION_COLUMN,
  ID_COLUMN,
  NAME_COLUMN
} from '../account-column/account-columns';

@Component({
  selector: 'cp-accounts-list-route',
  templateUrl: './account-list-route.component.html',
  styleUrls: ['./account-list-route.component.scss']
})
export class AccountListRouteComponent implements OnInit {

  accountsTableHelper: ShellTableHelper<WsAccount, WsAccountSearch>;
  selectedAccounts: WsAccount[] = [];
  columns: TableColumn<AccountColumn>[] = [
    ID_COLUMN,
    ACCOUNT_TYPE_COLUMN,
    NAME_COLUMN,
    ACCOUNTING_NUMBER_COLUMN,
    DESCRIPTION_COLUMN,
    CASH_COLUMN,
  ];

  constructor(private accountService: AccountService,
              private authService: AuthService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.accountsTableHelper = new ShellTableHelper<WsAccount, WsAccountSearch>(
      (searchFilter, pagination) => this.searchAccounts$(searchFilter, pagination)
    );
    this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
    ).subscribe(employee => this.initFilter(employee));
  }

  private searchAccounts$(searchFilter: WsAccountSearch | null, pagination: Pagination | null): Observable<SearchResult<WsAccount>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.accountService.searchAccountList$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultAccounts$(results)),
    );
  }

  private searchResultAccounts$(results: WsAccountSearchResult): Observable<SearchResult<WsAccount>> {
    const accounts$List = results.list.map(ref => this.accountService.getAccount$(ref));
    return concat(...accounts$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsAccount>;
      })
    );
  }

  private initFilter(employee: WsEmployee) {
    const searchFilter: WsAccountSearch = {
      companyRef: employee.companyRef
    };
    this.accountsTableHelper.setFilter(searchFilter);
  }

  onRowSelect(account: WsAccount) {
    this.router.navigate(['/accounting/account', account.id]);
  }
}
