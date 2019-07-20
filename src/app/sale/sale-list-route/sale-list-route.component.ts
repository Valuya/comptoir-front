import {Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {concat, Observable, of} from 'rxjs';
import {ApiService} from '../../api.service';
import {filter, map, mergeMap, take, toArray} from 'rxjs/operators';
import {TableColumn} from '../../util/table-column';
import {AMOUNT_COLUMN, CUSTOMER_COLUMN, DATETIME_COLUMN, ID_COLUMN, SaleColumn} from '../sale-column/sale-columns';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {WsEmployee, WsSale, WsSaleSearch, WsSalesSearchResult} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'cp-sales-list-route',
  templateUrl: './sale-list-route.component.html',
  styleUrls: ['./sale-list-route.component.scss']
})
export class SaleListRouteComponent implements OnInit {

  salesTableHelper: ShellTableHelper<WsSale, WsSaleSearch>;
  selectedSales: WsSale[] = [];
  columns: TableColumn<SaleColumn>[] = [
    ID_COLUMN,
    DATETIME_COLUMN,
    CUSTOMER_COLUMN,
    AMOUNT_COLUMN
  ];

  constructor(private apiService: ApiService,
              private authService: AuthService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.salesTableHelper = new ShellTableHelper<WsSale, WsSaleSearch>(
      (searchFilter, pagination) => this.searchSales$(searchFilter, pagination)
    );
    this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
    ).subscribe(employee => this.initFilter(employee));
  }

  private searchSales$(searchFilter: WsSaleSearch | null, pagination: Pagination | null): Observable<SearchResult<WsSale>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    const results$ = this.apiService.api.findSales({
      wsSaleSearch: searchFilter,
      offset: pagination.first,
      length: pagination.rows,
    }) as any as Observable<WsSalesSearchResult>;
    return results$.pipe(
      mergeMap(results => this.searchResultSales$(results)),
    );
  }

  private searchResultSales$(results: WsSalesSearchResult): Observable<SearchResult<WsSale>> {
    const sales$List = results.list.map(ref => this.apiService.api.getSale({
      id: ref.id
    }));
    return concat(...sales$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsSale>;
      })
    );
  }

  private initFilter(employee: WsEmployee) {
    const searchFilter: WsSaleSearch = {
      companyRef: employee.companyRef
    };
    this.salesTableHelper.setFilter(searchFilter);
  }

  onRowSelect(sale: WsSale) {
    this.router.navigate(['/sale', sale.id]);
  }
}
