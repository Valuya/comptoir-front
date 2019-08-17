import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
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
import {AuthService} from '../../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, mergeMap, publishReplay, refCount, take, toArray} from 'rxjs/operators';
import {Pagination} from '../../util/pagination';
import {combineLatest, concat, forkJoin, Observable, of} from 'rxjs';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {CompanyService} from '../../domain/commercial/company.service';
import {ItemService} from '../../domain/commercial/item.service';
import {SaleService} from '../../domain/commercial/sale.service';
import {SaleVariantColumn, SaleVariantColumns} from '../sale-variant-column/sale-variant-columns';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-sale-details-variants-route',
  templateUrl: './sale-details-variants-route.component.html',
  styleUrls: ['./sale-details-variants-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleDetailsVariantsRouteComponent implements OnInit {

  saleVariantTableHelper: ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch>;
  selectedsaleVariant: WsItemVariantSale[] = [];
  columns: TableColumn<SaleVariantColumn>[] = [
    SaleVariantColumns.QUANTITY_COLUMN,
    SaleVariantColumns.ITEM_VARIANT_COLUMN,
    SaleVariantColumns.STOCK_COLUMN,
    SaleVariantColumns.COMMENT_COLUMN,
    SaleVariantColumns.INCLUDE_CUSTOMER_LOYALTY_COLUMN,
    SaleVariantColumns.DISCOUNT_RATIO_COLUMN,
    SaleVariantColumns.VAT_EXCLUSIVE_COLUMN,
    SaleVariantColumns.VAT_RATE_COLUMN,
    SaleVariantColumns.TOTAL_VAT_INCLUSIVE,
  ];
  sale$: Observable<WsSale | null>;

  constructor(
    private saleService: SaleService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.saleVariantTableHelper = new ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch>(
      (searchFilter, pagination) => this.searchSaleVariant$(searchFilter, pagination)
    );
    const companyRef$ = this.authService.getNextNonNullLoggedEmployeeCompanyRef$();
    this.sale$ = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'sale').pipe(
      publishReplay(1), refCount(),
    );
    forkJoin(companyRef$, this.sale$.pipe(filter(i => i != null), take(1)))
      .subscribe(r => this.initFilter(r[0], r[1]));
  }

  private searchSaleVariant$(searchFilter: WsItemVariantSaleSearch | null, pagination: Pagination | null)
    : Observable<SearchResult<WsItemVariantSale>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.saleService.searchVariants$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultsaleVariant$(results)),
    );
  }

  private searchResultsaleVariant$(results: WsItemVariantSaleSearchResult): Observable<SearchResult<WsItemVariantSale>> {
    const saleVariant$List = results.list.map(ref => this.saleService.getVariant$(ref));
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
