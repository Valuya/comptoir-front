import {Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {WsCompanyRef, WsItemVariantStock, WsItemVariantStockSearch, WsItemVariantStockSearchResult, WsStock} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import * as Columns from '../stock-variant-column/stock-variant-columns';
import {AuthService} from '../../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, mergeMap, publishReplay, refCount, take, toArray} from 'rxjs/operators';
import {Pagination} from '../../util/pagination';
import {combineLatest, concat, forkJoin, Observable, of} from 'rxjs';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {StockService} from '../../domain/commercial/stock.service';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-stock-details-variants-route',
  templateUrl: './stock-details-variants-route.component.html',
  styleUrls: ['./stock-details-variants-route.component.scss']
})
export class StockDetailsVariantsRouteComponent implements OnInit {

  stockVariantTableHelper: ShellTableHelper<WsItemVariantStock, WsItemVariantStockSearch>;
  selectedstockVariant: WsItemVariantStock[] = [];
  columns: TableColumn<Columns.StockVariantColumn>[] = [
    Columns.ID_COLUMN,
    Columns.ORDER_POSITION_COLUMN,
    Columns.ITEM_VARIANT_COLUMN,
    Columns.COMMENT_COLUMN,
    Columns.QUANTITY_COLUMN,
    Columns.START_DATETIME_COLUMN,
    Columns.END_DATETIME_COLUMN,
    Columns.STOCK_CHANGE_TYPE_COLUMN,
    Columns.PREVIOUS_ITEM_COLUMN,
    Columns.SALE_VARIANT_COLUMN,
  ];
  stock$: Observable<WsStock | null>;

  constructor(
    private stockService: StockService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.stockVariantTableHelper = new ShellTableHelper<WsItemVariantStock, WsItemVariantStockSearch>(
      (searchFilter, pagination) => this.searchStockVariant$(searchFilter, pagination)
    );
    const companyRef$ = this.authService.getNextNonNullLoggedEmployeeCompanyRef$();
    this.stock$ = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'stock').pipe(
      publishReplay(1), refCount(),
    );
    forkJoin(companyRef$, this.stock$.pipe(filter(i => i != null), take(1)))
      .subscribe(r => this.initFilter(r[0], r[1]));
  }

  private searchStockVariant$(searchFilter: WsItemVariantStockSearch | null, pagination: Pagination | null): Observable<SearchResult<WsItemVariantStock>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.stockService.searchStockItems$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultstockVariant$(results)),
    );
  }

  private searchResultstockVariant$(results: WsItemVariantStockSearchResult): Observable<SearchResult<WsItemVariantStock>> {
    const stockVariant$List = results.list.map(ref => this.stockService.getStockVariant$(ref));
    return concat(...stockVariant$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsItemVariantStock>;
      })
    );
  }

  private initFilter(companyRef: WsCompanyRef, stock: WsStock) {
    if (companyRef == null || stock == null) {
      return;
    }
    const searchFilter: WsItemVariantStockSearch = {
        stockRef: {id: stock.id},
        companyRef: companyRef as object
      }
    ;
    this.stockVariantTableHelper.setFilter(searchFilter);
  }

  onRowSelect(stockVariant: WsItemVariantStock) {
    this.stock$.pipe(
      take(1)
    ).subscribe(item => {
      this.router.navigate(['/stock', item.id, 'variant', stockVariant.id]);
    });
  }

  onNewVariantClick() {
    this.router.navigate(['../new'], {
      relativeTo: this.activatedRoute
    });
  }
}
