import {Injectable} from '@angular/core';
import {BehaviorSubject, concat, forkJoin, Observable, of, Subject} from 'rxjs';
import {
  WsCompanyRef,
  WsItemRef,
  WsItemVariantRef,
  WsItemVariantSale,
  WsItemVariantSaleRef,
  WsItemVariantSaleSearch,
  WsItemVariantSaleSearchResult,
  WsItemVariantSearch,
  WsSale
} from '@valuya/comptoir-ws-api';
import {concatMap, filter, map, mergeMap, publishReplay, refCount, scan, switchMap, take, tap} from 'rxjs/operators';
import {ShellTableHelper} from '../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../util/pagination';
import {AuthService} from '../auth.service';
import {PaginationUtils} from '../util/pagination-utils';
import {SearchResult} from '../app-shell/shell-table/search-result';
import {SearchResultFactory} from '../app-shell/shell-table/search-result.factory';
import {SaleService} from '../domain/commercial/sale.service';
import {ItemService} from '../domain/commercial/item.service';
import {LocaleService} from '../locale.service';
import {WsLocaleText} from '../domain/lang/locale-text/ws-locale-text';
import {SimpleSearchResultResourceCache} from '../domain/util/cache/simple-search-result-resource-cache';

@Injectable({
  providedIn: 'root'
})
export class ComptoirSaleService {

  private activeSaleSource$ = new BehaviorSubject<WsSale>(null);
  private saleUpdatesSource$ = new Subject<Partial<WsSale>>();

  private addingItemInProgress$ = new BehaviorSubject<boolean>(false);
  private saleUpdating$ = new BehaviorSubject<boolean>(false);
  private updatedSale$: Observable<WsSale>;

  private saleItemsTableHelper: ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch>;

  private addVariantSource$ = new Subject<WsItemVariantRef>();

  // Cache a page of variant for each item
  private ItemVariantCacheSize: 30;
  private itemVariantsCaches: { [itemId: number]: SimpleSearchResultResourceCache<WsItemVariantRef> } = {};

  constructor(
    private saleService: SaleService,
    private itemService: ItemService,
    private localeService: LocaleService,
    private authService: AuthService,
  ) {
    this.updatedSale$ = this.activeSaleSource$.pipe(
      switchMap(initSale => this.applySaleUpdates$(initSale)),
      publishReplay(1), refCount()
    );
    this.saleItemsTableHelper = new ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch>(
      (searchFilter, pagination) => this.searchSaleItems$(searchFilter, pagination), {
        noDebounce: true
      }
    );

    this.addVariantSource$.pipe(
      concatMap(ref => this.addNextVariant$(ref)),
    );
    // this.itemSelectChildrenCache = new SimpleSeachResultResourceCache<WsItemVariantRef>(
    //   ref => this.fetchItemVarianFirstPages$(ref)
    // );
  }

  initSale(sale: WsSale) {
    this.activeSaleSource$.next(sale);
    if (sale == null) {
      this.saleItemsTableHelper.setFilter(null);
    } else {
      this.saleItemsTableHelper.setFilter({
        companyRef: sale.companyRef,
        saleRef: {id: sale.id}
      });
    }
  }

  updateSale(update: Partial<WsSale>) {
    this.saleUpdatesSource$.next(update);
  }

  udpdateSaleVariant$(ref: WsItemVariantSaleRef, update: Partial<WsItemVariantSale>): Observable<any> {
    return this.saleService.getVariant$(ref).pipe(
      switchMap(backendItem => this.saleService.updateVariant$(backendItem, update)),
      tap(newRef => this.onSaleVariantUpdated(newRef))
    );
  }

  getSale$(): Observable<WsSale> {
    return this.updatedSale$;
  }

  getItemsTableHelper(): ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch> {
    return this.saleItemsTableHelper;
  }

  addVariant(ref: WsItemVariantRef) {
    this.addVariantSource$.next(ref);
  }

  getVariantAddedLabel$(ref: WsItemVariantSaleRef): Observable<string> {
    return this.saleService.getVariant$(ref).pipe(
      switchMap(variant => this.itemService.getItemVariant$(variant.itemVariantRef)),
      switchMap(variant => this.itemService.getItem$(variant.itemRef)),
      switchMap(item => this.localeService.getLocalizedText(item.name as WsLocaleText[])),
      map(name => `Added ${name}`),
    );
  }

  listItemVariants$(itemRef: WsItemRef, query?: string): Observable<SearchResult<WsItemVariantRef>> {
    if (query == null || query.trim().length === 0) {
      return this.getCachedItemVariantForItem$(itemRef);
    } else {
      const partialFilter: WsItemVariantSearch = {
        itemRef: itemRef as object,
        variantReferenceContains: query
      };
      return this.doSearchVariants$(partialFilter, PaginationUtils.create(100));
    }
  }


  private applySaleUpdates$(initSale: WsSale) {
    if (initSale == null) {
      return of(null);
    }
    return concat(
      of(initSale),
      this.saleUpdatesSource$.pipe(
        scan((cur, next) => this.applySaleUpdate(cur, next), initSale)
      )
    );
  }

  private applySaleUpdate(cur: WsSale, next: Partial<WsSale>): WsSale {
    return Object.assign({}, cur, next);
  }

  private searchSaleItems$(searchFilter: WsItemVariantSaleSearch, pagination: Pagination): Observable<SearchResult<WsItemVariantSale>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    const sale$ = this.getSale$().pipe(take(1));
    const companyRef$ = this.authService.getLoggedEmployeeCompanyRef$().pipe(take(1));

    return forkJoin(sale$, companyRef$).pipe(
      switchMap(r => this.searchSaleItemsForSale$(r[0], r[1], searchFilter, pagination))
    );
  }

  private searchSaleItemsForSale$(sale: WsSale | null, companyRef: WsCompanyRef | null,
                                  saleSearch: WsItemVariantSaleSearch, pagination: Pagination)
    : Observable<SearchResult<WsItemVariantSale>> {
    if (sale == null || sale.id == null || companyRef == null) {
      return of(SearchResultFactory.emptyResults());
    }
    const searchFilter = Object.assign({}, saleSearch, {
      saleRef: {id: sale.id},
      companyRef: companyRef as object,
    } as Partial<WsItemVariantSaleSearch>);
    return this.saleService.searchVariants$(searchFilter, pagination).pipe(
      switchMap(results => this.fetchResultsItems$(results)),
    );
  }

  private fetchResultsItems$(results: WsItemVariantSaleSearchResult) {
    const items$List = results.list.map(
      ref => this.fetchSaleItemRef$(ref),
    );
    const itemsList$ = items$List.length === 0 ? of([]) : forkJoin(items$List);
    return itemsList$.pipe(
      map(list => SearchResultFactory.create(list, results.totalCount))
    );
  }

  private fetchSaleItemRef$(ref: WsItemVariantSaleRef) {
    return this.saleService.getVariant$(ref);
  }

  private createSale$(sale: WsSale) {
    return this.saleService.createSale$(sale).pipe(
      switchMap(newSaleRef => this.saleService.getSale$(newSaleRef)),
      tap(newSale => this.initSale(newSale)),
    );
  }

  private addNextVariant$(ref: WsItemVariantRef) {
    const curSale$ = this.getSale$().pipe(
      filter(s => s != null),
      take(1),
    );
    const curItems$ = this.saleItemsTableHelper.rows$.pipe(
      filter(s => s != null),
      take(1),
    );
    this.addingItemInProgress$.next(true);
    return forkJoin(curSale$, curItems$).pipe(
      concatMap(results => {
        return this.addOrAppendVariant$(results[0], results[1], ref).pipe(
          mergeMap(added => this.saleItemsTableHelper.reload()),
          tap(() => this.addingItemInProgress$.next(false))
        );
      }),
    );
  }

  private addOrAppendVariant$(curSale: WsSale | null, currentItems: WsItemVariantSale[], itemToAdd: WsItemVariantRef)
    : Observable<WsItemVariantSaleRef> {
    if (curSale == null || curSale.id == null) {
      return this.createSale$(curSale).pipe(
        switchMap(newSale => this.addOrAppendVariant$(newSale, [], itemToAdd))
      );
    } else if (currentItems.length === 0) {
      return this.saleService.createNewSaleItem$(curSale, itemToAdd);
    } else {
      const existingItem = currentItems.find(item => item.itemVariantRef.id === itemToAdd.id);
      if (existingItem == null) {
        return this.saleService.createNewSaleItem$(curSale, itemToAdd);
      } else {
        return this.saleService.isMultipleSale$(itemToAdd).pipe(
          switchMap(multipleSale => {
            if (multipleSale) {
              return this.saleService.createNewSaleItem$(curSale, itemToAdd);
            } else {
              return this.saleService.appendToExistingItem$(existingItem, 1);
            }
          })
        );
      }
    }
  }

  private getCachedItemVariantForItem$(itemRef: WsItemRef) {
    const cache = this.itemVariantsCaches[itemRef.id];
    if (cache == null) {
      this.itemVariantsCaches[itemRef.id] = new SimpleSearchResultResourceCache<WsItemVariantRef>(
        () => this.doSearchVariants$({
          itemRef: itemRef as object,
        }, PaginationUtils.create(100))
      );
      return this.itemVariantsCaches[itemRef.id].getOneResults$();
    } else {
      return this.itemVariantsCaches[itemRef.id].getOneResults$();
    }
  }

  private doSearchVariants$(partialFilter: WsItemVariantSearch, pagination: Pagination): Observable<SearchResult<WsItemVariantRef>> {
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      take(1),
      map(companyRef => Object.assign({}, partialFilter, {
        itemSearch: {companyRef: companyRef as object}
      } as WsItemVariantSearch)),
      switchMap(searchFilter => this.itemService.searchVariants$(searchFilter, pagination)),
    );
  }

  private onSaleVariantUpdated(ref: WsItemVariantSaleRef) {
    this.saleUpdatesSource$.next({});
  }
}
