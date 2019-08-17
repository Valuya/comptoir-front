import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {concat, Observable, of} from 'rxjs';
import {filter, map, mergeMap, take, toArray} from 'rxjs/operators';
import {TableColumn} from '../../util/table-column';
import {ACTIVE_COLUMN, DESCRIPTION_COLUMN, ID_COLUMN, StockColumn} from '../stock-column/stock-columns';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {WsEmployee, WsStock, WsStockSearch, WsStockSearchResult} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';
import {StockService} from '../../domain/commercial/stock.service';

@Component({
  selector: 'cp-stocks-list-route',
  templateUrl: './stock-list-route.component.html',
  styleUrls: ['./stock-list-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockListRouteComponent implements OnInit {

  stocksTableHelper: ShellTableHelper<WsStock, WsStockSearch>;
  selectedStocks: WsStock[] = [];
  columns: TableColumn<StockColumn>[] = [
    ID_COLUMN,
    DESCRIPTION_COLUMN,
    ACTIVE_COLUMN,
  ];

  constructor(private stockService: StockService,
              private authService: AuthService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.stocksTableHelper = new ShellTableHelper<WsStock, WsStockSearch>(
      (searchFilter, pagination) => this.searchStocks$(searchFilter, pagination)
    );
    this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
    ).subscribe(employee => this.initFilter(employee));
  }

  private searchStocks$(searchFilter: WsStockSearch | null, pagination: Pagination | null): Observable<SearchResult<WsStock>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.stockService.searchStockList$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultStocks$(results)),
    );
  }

  private searchResultStocks$(results: WsStockSearchResult): Observable<SearchResult<WsStock>> {
    const stocks$List = results.list.map(ref => this.stockService.getStock$(ref));
    return concat(...stocks$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsStock>;
      })
    );
  }

  private initFilter(employee: WsEmployee) {
    const searchFilter: WsStockSearch = {
      companyRef: employee.companyRef
    };
    this.stocksTableHelper.setFilter(searchFilter);
  }

  onRowSelect(stock: WsStock) {
    this.router.navigate(['/stock', stock.id]);
  }
}
