import {Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {concat, Observable, of} from 'rxjs';
import {filter, map, mergeMap, take, toArray} from 'rxjs/operators';
import {TableColumn} from '../../util/table-column';
import {ACCOUNT_COLUMN, BALANCE_COLUMN, BalanceColumn, CLOSED_COLUMN, DATETIME_COLUMN, ID_COLUMN} from '../balance-column/balance-columns';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {WsBalance, WsBalanceSearch, WsBalanceSearchResult, WsEmployee} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';
import {BalanceService} from '../../domain/accounting/balance.service';

@Component({
  selector: 'cp-balances-list-route',
  templateUrl: './balance-list-route.component.html',
  styleUrls: ['./balance-list-route.component.scss']
})
export class BalanceListRouteComponent implements OnInit {

  balancesTableHelper: ShellTableHelper<WsBalance, WsBalanceSearch>;
  selectedBalances: WsBalance[] = [];
  columns: TableColumn<BalanceColumn>[] = [
    ID_COLUMN,
    ACCOUNT_COLUMN,
    DATETIME_COLUMN,
    CLOSED_COLUMN,
    BALANCE_COLUMN,
  ];

  constructor(private balanceService: BalanceService,
              private authService: AuthService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.balancesTableHelper = new ShellTableHelper<WsBalance, WsBalanceSearch>(
      (searchFilter, pagination) => this.searchBalances$(searchFilter, pagination)
    );
    this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
    ).subscribe(employee => this.initFilter(employee));
  }

  private searchBalances$(searchFilter: WsBalanceSearch | null, pagination: Pagination | null): Observable<SearchResult<WsBalance>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.balanceService.searchBalanceList$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultBalances$(results)),
    );
  }

  private searchResultBalances$(results: WsBalanceSearchResult): Observable<SearchResult<WsBalance>> {
    const balances$List = results.list.map(ref => this.balanceService.getBalance$(ref));
    return concat(...balances$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsBalance>;
      })
    );
  }

  private initFilter(employee: WsEmployee) {
    const searchFilter: WsBalanceSearch = {
      companyRef: employee.companyRef
    };
    this.balancesTableHelper.setFilter(searchFilter);
  }

  onRowSelect(balance: WsBalance) {
    this.router.navigate(['/balance', balance.id]);
  }
}
