import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {BehaviorSubject, concat, forkJoin, Observable, of, Subscription} from 'rxjs';
import {map, mergeMap, publishReplay, refCount, tap, toArray} from 'rxjs/operators';
import {TableColumn} from '../../util/table-column';
import {SaleColumn, SaleColumns} from '../sale-column/sale-columns';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {WsSale, WsSaleSearch, WsSalesSearchResult} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {SaleService} from '../../domain/commercial/sale.service';
import {MenuItem, MessageService} from 'primeng/api';
import {SaleSearchFilterUtils} from '../sale-search-filter-utils';
import {RouteUtils} from '../../util/route-utils';
import {SaleWithPrice} from '../../domain/commercial/sale/sale-with-price';

@Component({
  selector: 'cp-sales-list-route',
  templateUrl: './sale-list-route.component.html',
  styleUrls: ['./sale-list-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleListRouteComponent implements OnInit, OnDestroy {

  salesTableHelper: ShellTableHelper<SaleWithPrice, WsSaleSearch>;
  selectedSales$ = new BehaviorSubject<WsSale[]>([]);
  columns: TableColumn<SaleColumn>[] = [
    SaleColumns.ID_COLUMN,
    SaleColumns.DATETIME_COLUMN,
    SaleColumns.REFERENCE_COLUMN,
    SaleColumns.CUSTOMER_COLUMN,
    SaleColumns.ITEM_COUNT_COLUMN,
    SaleColumns.TOTAL_AMOUNT_COLUMN,
    SaleColumns.ACTION_JUMP_TO_POS_COLUMN,
  ];

  selectionMenu$: Observable<MenuItem[]>;
  selectionLabel$: Observable<string | null>;

  private subscription: Subscription;

  constructor(private saleService: SaleService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.salesTableHelper = new ShellTableHelper<SaleWithPrice, WsSaleSearch>(
      (searchFilter, pagination) => this.searchSales$(searchFilter, pagination)
    );
    this.selectionMenu$ = this.selectedSales$.pipe(
      map(sales => this.createMenu(sales)),
      publishReplay(1), refCount()
    );
    this.selectionLabel$ = this.selectedSales$.pipe(
      map(s => s == null || s.length === 0 ? '' : `${s.length} sales selected`)
    );

    this.subscription = RouteUtils.observeRoutePathData$(this.activatedRoute.pathFromRoot, 'saleSearchFilter')
      .subscribe(searchFilter => this.salesTableHelper.setFilter(searchFilter as WsSaleSearch));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  onRowSelect(sale: SaleWithPrice) {
    this.router.navigate(['/sale', sale.sale.id]);
  }

  onSelectionChange$(sales: SaleWithPrice[]) {
    const saleList = sales.map(s => s.sale);
    this.selectedSales$.next(saleList);
  }

  onFilterChange(searchFilter: WsSaleSearch) {
    const routeFilter = SaleSearchFilterUtils.serializeFilter(searchFilter);
    this.router.navigate(['.'], {
      queryParams: routeFilter,
      relativeTo: this.activatedRoute,
    });
  }

  private searchSales$(searchFilter: WsSaleSearch | null, pagination: Pagination | null): Observable<SearchResult<SaleWithPrice>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.saleService.searchSales$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultSales$(results)),
    );
  }

  private searchResultSales$(results: WsSalesSearchResult): Observable<SearchResult<SaleWithPrice>> {
    const salesWithPriceList$List = results.list.map(ref => this.saleService.getSaleWithPrice$(ref));
    const saleWithPrices$ = salesWithPriceList$List.length === 0 ? of([]) : forkJoin(salesWithPriceList$List);
    return saleWithPrices$.pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<SaleWithPrice>;
      })
    );
  }

  private createMenu(sales: WsSale[]): MenuItem[] {
    if (sales.length === 0) {
      return [];
    }
    return [{
      label: 'Close',
      command: () => this.closeSales(sales),
    }, {
      label: 'Reopen',
      command: () => this.reopenSales(sales),
    }, {
      label: 'Cancel',
      command: () => this.cancelSales(sales),
    }];
  }

  private closeSales(sales: WsSale[]) {
    const task$List = sales.map(sale => this.saleService.closeSale$({id: sale.id}));
    const task$ = task$List.length === 0 ? of(null) : forkJoin(task$List);
    task$.subscribe(() => {
      this.salesTableHelper.reload();
      this.selectedSales$.next([]);
      this.messageService.add({
        severity: 'success',
        summary: 'Sales close'
      });
    });
  }

  private reopenSales(sales: WsSale[]) {
    const task$List = sales.map(sale => this.saleService.openSale$({id: sale.id}));
    const task$ = task$List.length === 0 ? of(null) : forkJoin(task$List);
    task$.subscribe(() => {
      this.salesTableHelper.reload();
      this.selectedSales$.next([]);
      this.messageService.add({
        severity: 'success',
        summary: 'Sales reopened'
      });
    });
  }

  private cancelSales(sales: WsSale[]) {
    const task$List = sales.map(sale => this.saleService.cancelSale$({id: sale.id}));
    const task$ = task$List.length === 0 ? of(null) : forkJoin(task$List);
    task$.subscribe(() => {
      this.salesTableHelper.reload();
      this.selectedSales$.next([]);
      this.messageService.add({
        severity: 'success',
        summary: 'Sales cancelled'
      });
    });
  }

}
