import {Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {
  WsCompanyRef,
  WsItem,
  WsItemVariantSale,
  WsItemVariantSaleSearch,
  WsItemVariantSaleSearchResult,
  WsSale
} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import * as Columns from '../sale-variant-column/sale-variant-columns';
import {ApiService} from '../../api.service';
import {AuthService} from '../../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, mergeMap, publishReplay, refCount, take, toArray} from 'rxjs/operators';
import {Pagination} from '../../util/pagination';
import {combineLatest, concat, forkJoin, Observable, of} from 'rxjs';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';

@Component({
  selector: 'cp-sale-details-variants-route',
  templateUrl: './sale-details-variants-route.component.html',
  styleUrls: ['./sale-details-variants-route.component.scss']
})
export class SaleDetailsVariantsRouteComponent implements OnInit {

  saleVariantTableHelper: ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch>;
  selectedsaleVariant: WsItemVariantSale[] = [];
  columns: TableColumn<Columns.SaleVariantColumn>[] = [
    Columns.QUANTITY_COLUMN,
    Columns.ITEM_VARIANT_COLUMN,
    Columns.STOCK_COLUMN,
    Columns.COMMENT_COLUMN,
    Columns.INCLUDE_CUSTOMER_LOYALTY_COLUMN,
    Columns.DISCOUNT_RATIO_COLUMN,

    Columns.VAT_EXCLUSIVE_COLUMN,
    Columns.VAT_RATE_COLUMN,
    Columns.TOTAL_COLUMN,
  ];
  sale$: Observable<WsSale | null>;

  constructor(private apiService: ApiService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.saleVariantTableHelper = new ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch>(
      (searchFilter, pagination) => this.searchSaleVariant$(searchFilter, pagination)
    );
    const companyRef$ = this.authService.getLoggedEmployeeCompanyRef$().pipe(
      filter(c => c != null),
      take(1)
    );
    const item$List = this.activatedRoute.pathFromRoot.map(
      route => route.data.pipe(map(data => data.sale))
    );
    this.sale$ = combineLatest(...item$List).pipe(
      map(list => list.find(sale => sale != null)),
      publishReplay(1), refCount(),
    );
    forkJoin(companyRef$, this.sale$.pipe(filter(i => i != null), take(1)))
      .subscribe(r => this.initFilter(r[0], r[1]));
  }

  private searchSaleVariant$(searchFilter: WsItemVariantSaleSearch | null, pagination: Pagination | null): Observable<SearchResult<WsItemVariantSale>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    const results$ = this.apiService.api.searchItemVariantSales({
      wsItemVariantSaleSearch: searchFilter,
      offset: pagination.first,
      length: pagination.rows,
    }) as any as Observable<WsItemVariantSaleSearchResult>;
    return results$.pipe(
      mergeMap(results => this.searchResultsaleVariant$(results)),
    );
  }

  private searchResultsaleVariant$(results: WsItemVariantSaleSearchResult): Observable<SearchResult<WsItemVariantSale>> {
    const saleVariant$List = results.list.map(ref => this.apiService.api.getItemVariantSale({
      id: ref.id
    }));
    return concat(...saleVariant$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsItemVariantSale>;
      })
    );
  }

  private initFilter(companyRef: WsCompanyRef, sale: WsSale) {
    if (companyRef == null || sale == null) {
      return;
    }
    const searchFilter: WsItemVariantSaleSearch = {
      saleRef: {id: sale.id},
      companyRef: companyRef as object
  }
    ;
    this.saleVariantTableHelper.setFilter(searchFilter);
  }

  onRowSelect(saleVariant: WsItemVariantSale) {
    this.sale$.pipe(
      take(1)
    ).subscribe(item => {
      this.router.navigate(['/sale', item.id, 'variant', saleVariant.id]);
    });
  }

  onNewVariantClick() {
    this.router.navigate(['../new'], {
      relativeTo: this.activatedRoute
    });
  }
}
