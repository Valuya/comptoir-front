import {BehaviorSubject, combineLatest, EMPTY, forkJoin, merge, Observable, of, Subject} from 'rxjs';
import {
  WsAccountAccountTypeEnum,
  WsAccountingEntry,
  WsAccountingEntryRef,
  WsAccountingEntrySearch,
  WsCompanyRef,
  WsItemRef,
  WsItemVariantRef,
  WsItemVariantSale,
  WsItemVariantSalePriceDetails,
  WsItemVariantSaleRef,
  WsItemVariantSaleSearch,
  WsItemVariantSaleSearchResult,
  WsItemVariantSearch,
  WsSale,
  WsSalePriceDetails,
  WsSaleRef,
  WsSaleSearch
} from '@valuya/comptoir-ws-api';
import {
  catchError,
  concatMap,
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  publishReplay,
  refCount,
  switchMap,
  take,
  tap
} from 'rxjs/operators';
import {ShellTableHelper} from '../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../util/pagination';
import {AuthService} from '../auth.service';
import {PaginationUtils} from '../util/pagination-utils';
import {SearchResult} from '../app-shell/shell-table/search-result';
import {SearchResultFactory} from '../app-shell/shell-table/search-result.factory';
import {SaleService} from '../domain/commercial/sale.service';
import {ItemService} from '../domain/commercial/item.service';
import {LocaleService} from '../locale.service';
import {SimpleSearchResultResourceCache} from '../domain/util/cache/simple-search-result-resource-cache';
import {Injectable} from '@angular/core';
import {AccountingService} from '../domain/accounting/accounting.service';
import {SaleEvent} from './sale-event/sale-event';
import {SaleEventType} from './sale-event/sale-event-type';
import {UpdateSaleEvent} from './sale-event/update-sale-event';
import {AddItemVariantEvent} from './sale-event/add-item-variant-event';
import {SaleState} from './sale-state';
import {RemoveSaleVariantEvent} from './sale-event/remove-sale-variant-event';
import {UpdateSaleVariantEvent} from './sale-event/update-sale-variant-event';
import {AddSalePaymentEvent} from './sale-event/add-sale-payment-event';
import {RemoveSalePaymentEvent} from './sale-event/remove-sale-payment-event';
import {UpdateSaleVariantPriceEvent} from './sale-event/update-sale-variant-price-event';
import {WsAccountingEntrySearchAccountSearchAccountTypeEnum} from '@valuya/comptoir-ws-api/models/WsAccountingEntrySearchAccountSearch';
import {UpdateSalePriceEvent} from './sale-event/update-sale-price-event';
import {VariantSaleWithPrice} from '../domain/commercial/item-variant-sale/variant-sale-with-price';

@Injectable({
  providedIn: 'root'
})
export class ComptoirSaleService {

  // Sale source, emitting when active sale is changed only (navigation to another sale ref)
  private activeSaleSource$ = new BehaviorSubject<WsSale>(null);
  // Sale event queue
  private saleEventsSource$ = new Subject<SaleEvent>();
  // Current sale state
  private saleState$: Observable<SaleState | null>;

  private creatingSaleInProgress$ = new BehaviorSubject<boolean>(false);
  private updatingSaleInProgress$ = new BehaviorSubject<boolean>(false);
  private updatingItemsInProgress$ = new BehaviorSubject<boolean>(false);
  private updatingPaymentsInProgress$ = new BehaviorSubject<boolean>(false);

  // Updated sale values, emitted on each state update
  private sale$: Observable<WsSale | null>;
  private salePrice$: Observable<WsSalePriceDetails | null>;
  private saleRef$: Observable<WsSale | null>;
  private saleTotalPaid$: Observable<number | null>;
  private saleRemaining$: Observable<number | null>;
  private lastUpdatedItem$: Observable<WsItemVariantSale | null>;

  // Tables helpers are used for lists to allow easy sorting/filtering
  private saleItemsTableHelper: ShellTableHelper<VariantSaleWithPrice, WsItemVariantSaleSearch>;
  private saleAccountingEntriessTableHelper: ShellTableHelper<WsAccountingEntry, WsAccountingEntrySearch>;

  // Cache a page of variant for each item, to be used by the item-and-variant-select in the fill view
  private itemVariantsCaches: { [itemId: number]: SimpleSearchResultResourceCache<WsItemVariantRef> } = {};
  // Cache a page of open sales, to be used by the active-sale-select component
  private openSalesCaches: SimpleSearchResultResourceCache<WsSaleRef>;

  constructor(
    private saleService: SaleService,
    private itemService: ItemService,
    private accountingService: AccountingService,
    private localeService: LocaleService,
    private authService: AuthService,
  ) {
    this.saleItemsTableHelper = new ShellTableHelper<VariantSaleWithPrice, WsItemVariantSaleSearch>(
      (searchFilter, pagination) => this.searchSaleItems$(searchFilter),
      {
        noDebounce: true,
        ignorePagination: true,
      }
    );
    this.saleAccountingEntriessTableHelper = new ShellTableHelper<WsAccountingEntry, WsAccountingEntrySearch>(
      (searchFilter, pagination) => this.getSaleAccountingEntries$(searchFilter),
      {
        noDebounce: true,
        ignorePagination: true
      }
    );
    this.openSalesCaches = new SimpleSearchResultResourceCache<WsSaleRef>(
      () => this.searchOpenSales$()
    );

    this.saleState$ = this.activeSaleSource$.pipe(
      distinctUntilChanged(),
      // tap(s => console.log('sale ' + s.id)),
      switchMap(sale => this.getNextSaleStates$(sale)),
      // tap(() => console.log('state')),
      publishReplay(1), refCount()
    );

    this.sale$ = this.saleState$.pipe(
      map(state => state == null ? null : state.sale),
      publishReplay(1), refCount()
    );
    this.salePrice$ = this.saleState$.pipe(
      map(state => state == null ? null : state.salePriceDetails),
      publishReplay(1), refCount()
    );
    this.saleTotalPaid$ = this.saleState$.pipe(
      map(state => state == null ? null : state.totalPaid),
      publishReplay(1), refCount()
    );
    this.lastUpdatedItem$ = this.saleState$.pipe(
      map(state => state == null ? null : state.lastUpdatedVariant),
      publishReplay(1), refCount()
    );

    this.saleRef$ = this.activeSaleSource$.pipe(
      map(s => s == null || s.id == null ? null : {id: s.id}),
      publishReplay(1), refCount()
    );

    this.saleRemaining$ = combineLatest(this.salePrice$, this.saleTotalPaid$).pipe(
      map(results => this.getSaleAmountRemaining(results[0], results[1])),
      publishReplay(1), refCount()
    );

  }

  initSale(sale: WsSale) {
    if (sale == null) {
      throw new Error('No sale');
    }

    if (sale.id == null) {
      this.saleItemsTableHelper.setFilter(null);
      this.saleAccountingEntriessTableHelper.setFilter(null);
    } else {
      this.saleItemsTableHelper.setFilter({
        companyRef: sale.companyRef,
        saleRef: {id: sale.id}
      });
      this.saleAccountingEntriessTableHelper.setFilter({
        companyRef: sale.companyRef,
        accountingTransactionRef: sale.accountingTransactionRef,
        accountSearch: {
          accountType: WsAccountAccountTypeEnum.PAYMENT as any as WsAccountingEntrySearchAccountSearchAccountTypeEnum,
          companyRef: sale.companyRef,
        }
      });
    }
    this.activeSaleSource$.next(sale);
  }

  createSaleIfRequired$(): Observable<WsSale | never> {
    return this.creatingSaleInProgress$.pipe(
      filter(busy => !busy),
      take(1),
      map(() => this.getActiveSaleOptional()),
      mergeMap(activeSale => {
        if (activeSale.id == null) {
          return this.createSale$(activeSale);
        } else {
          return EMPTY;
        }
      })
    );
  }

  updateSale<K extends keyof WsSale>(update: Partial<WsSale>) {
    const curSale = this.activeSaleSource$.getValue();
    const curSaleRef = {id: curSale.id} as WsSaleRef;
    this.saleEventsSource$.next(new UpdateSaleEvent(curSaleRef, update));
  }

  addVariant(ref: WsItemVariantRef) {
    const curSale = this.activeSaleSource$.getValue();
    if (curSale.id == null) {
      throw new Error('Cannot add variant to new sale');
    }

    const curSaleRef = {id: curSale.id} as WsSaleRef;
    this.saleEventsSource$.next(new AddItemVariantEvent(curSaleRef, ref));
  }

  removeVariant(ref: WsItemVariantSaleRef) {
    const curSale = this.activeSaleSource$.getValue();
    const curSaleRef = {id: curSale.id} as WsSaleRef;
    this.saleEventsSource$.next(new RemoveSaleVariantEvent(curSaleRef, ref));
  }

  udpdateSaleVariant<K extends keyof WsItemVariantSale>(ref: WsItemVariantSaleRef, partialUpdate: Partial<WsItemVariantSale>) {
    const curSale = this.activeSaleSource$.getValue();
    const curSaleRef = {id: curSale.id} as WsSaleRef;
    this.saleEventsSource$.next(new UpdateSaleVariantEvent(curSaleRef, ref, partialUpdate));
  }

  updateSaleVariantPrice<K extends keyof WsItemVariantSalePriceDetails>(
    ref: WsItemVariantSaleRef, property: K, value: number
  ) {
    const curSale = this.activeSaleSource$.getValue();
    const curSaleRef = {id: curSale.id} as WsSaleRef;
    this.saleEventsSource$.next(new UpdateSaleVariantPriceEvent(curSaleRef, ref, property, value));
  }

  updateSalePrice<K extends keyof WsSalePriceDetails>(
    property: K, value: number
  ) {
    const curSale = this.activeSaleSource$.getValue();
    const curSaleRef = {id: curSale.id} as WsSaleRef;
    this.saleEventsSource$.next(new UpdateSalePriceEvent(curSaleRef, property, value));
  }


  addTransaction(newEntry: WsAccountingEntry) {
    const curSale = this.activeSaleSource$.getValue();
    const curSaleRef = {id: curSale.id} as WsSaleRef;
    this.saleEventsSource$.next(new AddSalePaymentEvent(curSaleRef, newEntry));
  }

  removeTransaction(ref: WsAccountingEntryRef) {
    const curSale = this.activeSaleSource$.getValue();
    const curSaleRef = {id: curSale.id} as WsSaleRef;
    this.saleEventsSource$.next(new RemoveSalePaymentEvent(curSaleRef, ref));
  }

  getSale$(): Observable<WsSale> {
    return this.sale$;
  }

  getSalePrice$(): Observable<WsSalePriceDetails> {
    return this.salePrice$;
  }

  getActiveSaleOptional(): WsSale | null {
    return this.activeSaleSource$.getValue();
  }

  getSaleRef$(): Observable<WsSaleRef> {
    return this.saleRef$;
  }

  getSaleTotalPaid$(): Observable<number> {
    return this.saleTotalPaid$;
  }

  getSaleRemainingToPay$(): Observable<number> {
    return this.saleRemaining$;
  }

  getLastUpdatedItem$(): Observable<WsItemVariantSale | null> {
    return this.lastUpdatedItem$;
  }

  getItemsTableHelper(): ShellTableHelper<VariantSaleWithPrice, WsItemVariantSaleSearch> {
    return this.saleItemsTableHelper;
  }

  getItemWithPrices$(): Observable<VariantSaleWithPrice[]> {
    return this.saleState$.pipe(
      map(state => state == null ? [] : state.items),
      publishReplay(1), refCount()
    );
  }

  getAccountingEntriesTableHelper(): ShellTableHelper<WsAccountingEntry, WsAccountingEntrySearch> {
    return this.saleAccountingEntriessTableHelper;
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

  getOpenSales$(): Observable<SearchResult<WsSaleRef>> {
    return this.openSalesCaches.getResults$();
  }

  closeActiveSale$(): Observable<any> {
    return this.getSaleRef$().pipe(
      take(1),
      switchMap(ref => this.saleService.closeSale$(ref)),
      tap(() => this.openSalesCaches.invalidate()),
    );
  }

  reopenActiveSale$(): Observable<WsSaleRef> {
    return this.getSaleRef$().pipe(
      take(1),
      switchMap(ref => this.saleService.openSale$(ref)),
      switchMap(ref => this.saleService.getSale$(ref)),
      tap(() => this.openSalesCaches.invalidate()),
      tap(sale => this.initSale(sale)),
    );
  }

  cancelSale$(ref?: WsSaleRef): Observable<WsSaleRef> {
    const saleRef$ = ref == null ? this.getSaleRef$() : of(ref);
    return saleRef$.pipe(
      take(1),
      switchMap(saleRef => this.saleService.cancelSale$(saleRef).pipe(
        tap(() => {
          const curSale = this.activeSaleSource$.getValue();
          if (curSale != null && curSale.id === saleRef.id) {
            this.activeSaleSource$.next(null);
          }
        })
        )
      ),
      tap(() => this.openSalesCaches.invalidate()),
    );
  }

  isUpdating$(): Observable<boolean> {
    return combineLatest(
      this.updatingPaymentsInProgress$,
      this.updatingItemsInProgress$,
      this.updatingSaleInProgress$
    ).pipe(
      debounceTime(100),
      map(r => r[0] || r[1] || r[2]),
      publishReplay(1), refCount()
    );
  }


  private searchSaleItemsWithPagination$(searchFilter: WsItemVariantSaleSearch, pagination: Pagination)
    : Observable<SearchResult<VariantSaleWithPrice>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    const sale$ = this.activeSaleSource$.pipe(take(1));
    const companyRef$ = this.authService.getNextNonNullLoggedEmployeeCompanyRef$();

    return forkJoin(sale$, companyRef$).pipe(
      switchMap(r => this.searchSaleItemsForSale$(r[0], r[1], searchFilter, pagination))
    );
  }

  private searchSaleItemsForSale$(sale: WsSale | null, companyRef: WsCompanyRef | null,
                                  saleSearch: WsItemVariantSaleSearch, pagination: Pagination)
    : Observable<SearchResult<VariantSaleWithPrice>> {
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

  private searchSaleAccountingEntries$(searchFilter: WsAccountingEntrySearch, pagination: Pagination)
    : Observable<SearchResult<WsAccountingEntry>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    const sale$ = this.activeSaleSource$.pipe(take(1));
    const companyRef$ = this.authService.getLoggedEmployeeCompanyRef$().pipe(take(1));

    return forkJoin(sale$, companyRef$).pipe(
      switchMap(r => this.searchSaleAccountingEntriesForSale$(r[0], r[1], searchFilter, pagination))
    );
  }

  private fetchResultsItems$(results: WsItemVariantSaleSearchResult) {
    const items$List = results.list.map(
      ref => this.saleService.getVariantWithPrice$(ref),
    );
    const itemsList$ = items$List.length === 0 ? of([]) : forkJoin(items$List);
    return itemsList$.pipe(
      map(list => SearchResultFactory.create(list, results.totalCount))
    );
  }

  private searchSaleAccountingEntriesForSale$(sale: WsSale | null, companyRef: WsCompanyRef | null,
                                              entrySearch: WsAccountingEntrySearch, pagination: Pagination)
    : Observable<SearchResult<WsAccountingEntry>> {
    if (sale == null || sale.id == null || companyRef == null) {
      return of(SearchResultFactory.emptyResults());
    }
    const searchFilter = Object.assign({}, entrySearch, {
      companyRef: companyRef as object,
    } as Partial<WsAccountingEntrySearch>);
    return this.accountingService.searchEntries$(searchFilter, pagination).pipe(
      switchMap(results => this.fetchResultsEntries$(results)),
    );
  }

  private fetchResultsEntries$(results: SearchResult<WsAccountingEntryRef>) {
    const items$List = results.list.map(
      ref => this.accountingService.getEntry$(ref),
    );
    const itemsList$ = items$List.length === 0 ? of([]) : forkJoin(items$List);
    return itemsList$.pipe(
      map(list => SearchResultFactory.create(list, results.totalCount))
    );
  }

  private createSale$(sale: WsSale) {
    this.creatingSaleInProgress$.next(true);
    return this.saleService.createSale$(sale).pipe(
      switchMap(newSaleRef => this.saleService.getSale$(newSaleRef)),
      delay(0),
      tap(newSale => this.initSale(newSale)),
      tap(newSale => this.openSalesCaches.invalidate()),
      tap(newSale => this.creatingSaleInProgress$.next(false)),
    );
  }


  private addOrAppendVariant$(curSale: WsSale, currentItems: WsItemVariantSale[], itemToAdd: WsItemVariantRef)
    : Observable<WsItemVariantSaleRef> {
    if (curSale == null || curSale.id == null) {
      throw new Error('Non persisted sale');
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
              const curItemRef: WsItemVariantSaleRef = {id: existingItem.id};
              return this.saleService.getVariantPriceDetails$(curItemRef).pipe(
                map(price => price.quantity + 1),
                switchMap(newQuantity => this.saleService.updateItemVariantQuantity$(curItemRef, newQuantity)),
                map(price => price.variantSaleRef)
              );
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


  private searchSaleItems$(searchFilter: WsItemVariantSaleSearch)
    : Observable<SearchResult<VariantSaleWithPrice>> {
    const emptyResults$ = of(SearchResultFactory.emptyResults<VariantSaleWithPrice>());
    if (searchFilter == null) {
      return emptyResults$;
    }

    const restResults$ = this.searchSaleItemsWithPagination$(searchFilter, PaginationUtils.create(100));
    return restResults$;
  }

  private getSaleAccountingEntries$(searchFilter: WsAccountingEntrySearch)
    : Observable<SearchResult<WsAccountingEntry>> {
    const emptyResults$ = of(SearchResultFactory.emptyResults<WsAccountingEntry>());

    if (searchFilter == null) {
      return emptyResults$;
    }

    const restResults$ = this.searchSaleAccountingEntries$(searchFilter, PaginationUtils.create(100));
    return restResults$;
  }

  private getSaleAmountRemaining(salePrice: WsSalePriceDetails, paid: number) {
    if (salePrice == null || paid == null) {
      return 0;
    }
    return salePrice.totalPriceVatInclusive - paid;
  }

  private searchOpenSales$(): Observable<SearchResult<WsSaleRef>> {
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      map(r => this.createOpenSalesSearchFilter(r)),
      switchMap(searchFilter => searchFilter == null ?
        of(SearchResultFactory.emptyResults()) : this.saleService.searchSales$(searchFilter, PaginationUtils.create(10))
      ),
    );
  }

  private createOpenSalesSearchFilter(companyRef: WsCompanyRef | null): WsSaleSearch {
    if (companyRef == null) {
      return null;
    }
    return {
      closed: false,
      companyRef: companyRef as object,
    };
  }


  private getNextSaleStates$(sale: WsSale): Observable<SaleState> {
    if (sale == null) {
      return of(null);
    }
    const seedState = this.createSaleState(sale, null, [], 0, []);
    if (sale.id == null) {
      return of(seedState);
    }
    const initState$ = this.refetchState$(seedState, {
      refetchSalePrice: true,
      reSearchItems: true,
      refetchTotalPaid: true,
      reSearchPayments: true,
    });
    const nextStates$ = this.saleEventsSource$.pipe(
      // tap(e => console.log('event on ' + e.saleRef.id)),
      concatMap(event => this.applySaleEvent$(event))
    );
    return merge(initState$, nextStates$);
  }

  private refetchState$(state: SaleState, options?: {
    // TODO: simplify, do not fetch itemvariantsale in the table helper and allow to refetch 1 from ref
    refetchSale?: boolean,
    refetchSalePrice?: boolean,
    forceRefetchSalePrice?: boolean,
    reSearchItems?: boolean,
    refetchTotalPaid?: boolean,
    reSearchPayments?: boolean,
  }): Observable<SaleState> {
    const saleId = state.sale.id;
    if (saleId == null) {
      return of(state);
    }
    const nonNullOptions = options || {};

    const sale$ = nonNullOptions.refetchSale ?
      this.saleService.getSale$({id: saleId}, true) : of(state.sale);

    let salePrice$: Observable<WsSalePriceDetails>;
    if (nonNullOptions.forceRefetchSalePrice) {
      salePrice$ = this.saleService.getSalePriceDetails$({id: saleId}, true);
    } else if (nonNullOptions.refetchSalePrice) {
      salePrice$ = this.saleService.getSalePriceDetails$({id: saleId});
    } else {
      salePrice$ = of(state.salePriceDetails);
    }

    const saleItems$ = nonNullOptions.reSearchItems ?
      this.saleItemsTableHelper.reload() : of(state.items);

    const totalPaid$ = nonNullOptions.refetchTotalPaid ?
      this.saleService.getSaleTotalPaid$({id: saleId}) : of(state.totalPaid);

    const paymentItems$ = nonNullOptions.reSearchPayments ?
      this.saleAccountingEntriessTableHelper.reload() : of(state.paymentItems);

    this.updatingSaleInProgress$.next(true);
    this.updatingItemsInProgress$.next(true);
    this.updatingPaymentsInProgress$.next(true);
    return combineLatest(sale$, salePrice$, saleItems$, totalPaid$, paymentItems$).pipe(
      map(r => this.createSaleState(r[0], r[1], r[2], r[3], r[4])),
      delay(0),
      tap(() => {
        this.updatingSaleInProgress$.next(false);
        this.updatingItemsInProgress$.next(false);
        this.updatingPaymentsInProgress$.next(false);
      })
    );
  }

  private createSaleState(saleValue: WsSale, salePrice: WsSalePriceDetails,
                          itemsValue: VariantSaleWithPrice[],
                          totalPaidValue: number, paymentsValue: WsAccountingEntry[]): SaleState {
    return {
      sale: saleValue,
      salePriceDetails: salePrice,
      items: itemsValue,
      totalPaid: totalPaidValue,
      paymentItems: paymentsValue,
      lastUpdatedVariantIndex: null,
      lastUpdatedVariant: null
    };
  }

  private applySaleEvent$(event: SaleEvent): Observable<SaleState> {
    return this.saleState$.pipe(
      filter(state => state.sale.id != null),
      take(1),
      // tap(() => console.log('apply event')),
      switchMap(state => this.applySaleEventOnState$(event, state)),
      catchError(e => {
        console.warn('Event error:');
        console.warn(e);
        return this.saleState$.pipe(take(1));
      }),
    );
  }

  private applySaleEventOnState$(event: SaleEvent, state: SaleState): Observable<SaleState | never> {
    if (event.saleRef.id !== state.sale.id) {
      throw new Error('Sale mismatch');
    }

    let updatedState$: Observable<SaleState>;
    switch (event.type) {
      case SaleEventType.UPDATE_SALE:
        updatedState$ = this.applyUpdateSaleEvent$(event as UpdateSaleEvent<any>, state);
        break;
      case SaleEventType.UPDATE_SALE_PRICE:
        updatedState$ = this.applyUpdateSalePriceEvent$(event as UpdateSalePriceEvent<any>, state);
        break;
      case SaleEventType.ADD_ITEM_VARIANT:
        updatedState$ = this.applyAddItemVariantEvent$(event as AddItemVariantEvent, state);
        break;
      case SaleEventType.REMOVE_SALE_VARIANT:
        updatedState$ = this.applyRemoveSaleVariantEvent$(event as RemoveSaleVariantEvent, state);
        break;
      case SaleEventType.UPDATE_SALE_VARIANT:
        updatedState$ = this.applyUpdateSaleVariantEvent$(event as UpdateSaleVariantEvent<any>, state);
        break;
      case SaleEventType.UPDATE_SALE_VARIANT_PRICE:
        updatedState$ = this.applyUpdateSaleVariantPriceEvent$(event as UpdateSaleVariantPriceEvent<any>, state);
        break;
      case SaleEventType.ADD_SALE_PAYMENT:
        updatedState$ = this.applyAddSalePaymentEvent(event as AddSalePaymentEvent, state);
        break;
      case SaleEventType.REMOVE_SALE_PAYMENT:
        updatedState$ = this.applyRemoveSalePaymentEvent(event as RemoveSalePaymentEvent, state);
        break;
      default:
        throw new Error('Unhandled event');
    }
    // We could return local state right away, but then would need to sync it with server updates.
    // We rather refetch sale and items on each update
    return updatedState$;
  }

  private applyUpdateSaleEvent$(event: UpdateSaleEvent<any>, state: SaleState) {
    const saleToUpdate: WsSale = Object.assign({}, state.sale, event.update);

    this.updatingSaleInProgress$.next(true);
    return this.saleService.saveSale(saleToUpdate).pipe(
      delay(0),
      tap(() => this.updatingSaleInProgress$.next(false)),
      mergeMap(() => this.refetchState$(state, {
        refetchSale: true
      })),
    );
  }


  private applyUpdateSalePriceEvent$(event: UpdateSalePriceEvent<any>, state: SaleState) {
    const property = event.property;
    const value = event.value;
    const saleRef = event.saleRef;

    this.updatingSaleInProgress$.next(true);
    return this.updateSalePrice$(saleRef, property, value).pipe(
      delay(0),
      tap(() => this.updatingSaleInProgress$.next(false)),
      mergeMap(() => this.refetchState$(state, {
        refetchSalePrice: true,
      })),
    );
  }


  private applyAddItemVariantEvent$(event: AddItemVariantEvent, state: SaleState) {
    this.updatingItemsInProgress$.next(true);
    const variantList = state.items.map(itemWithPrice => itemWithPrice.variantSale);
    return this.addOrAppendVariant$(state.sale, variantList, event.variantRef).pipe(
      delay(0),
      tap(() => this.updatingItemsInProgress$.next(false)),
      mergeMap((variantRef) => this.refetchState$(state, {
        forceRefetchSalePrice: true,
        reSearchItems: true,
      }).pipe(
        map(newState => this.setLastUpdatedItem(newState, variantRef))
      )),
    );
  }

  private applyRemoveSaleVariantEvent$(event: RemoveSaleVariantEvent, state: SaleState) {
    const variantRef = event.saleVariantRef;
    this.updatingItemsInProgress$.next(true);
    return this.saleService.removeVariant(variantRef).pipe(
      delay(0),
      tap(() => this.updatingItemsInProgress$.next(false)),
      mergeMap(() => this.refetchState$(state, {
        forceRefetchSalePrice: true,
        reSearchItems: true,
      })),
    );
  }

  private applyUpdateSaleVariantEvent$(event: UpdateSaleVariantEvent<any>, state: SaleState) {
    const variantRef = event.variantRef;
    const curVariant = state.items.find(i => i.variantSale.id === variantRef.id);
    const variantToUpdate = Object.assign({}, curVariant, event.update);

    this.updatingItemsInProgress$.next(true);
    return this.saleService.saveVariant(variantToUpdate).pipe(
      delay(0),
      tap(() => this.updatingItemsInProgress$.next(false)),
      mergeMap((updatedRef) => this.refetchState$(state, {
        reSearchItems: true,
      }).pipe(
        map(newState => this.setLastUpdatedItem(newState, updatedRef))
      )),
    );
  }

  private applyUpdateSaleVariantPriceEvent$(event: UpdateSaleVariantPriceEvent<any>, state: SaleState) {
    const variantRef = event.variantRef;
    const property = event.property;
    const value = event.value;

    this.updatingItemsInProgress$.next(true);
    return this.updateVariantPrice$(variantRef, property, value).pipe(
      delay(0),
      tap(() => this.updatingItemsInProgress$.next(false)),
      mergeMap((updatedRef) => this.refetchState$(state, {
        forceRefetchSalePrice: true,
        reSearchItems: true,
      }).pipe(
        map(newState => this.setLastUpdatedItem(newState, variantRef))
      )),
    );
  }

  private applyAddSalePaymentEvent(event: AddSalePaymentEvent, state: SaleState) {
    this.updatingPaymentsInProgress$.next(true);
    return this.saleService.addPayment$(event.saleRef, event.entry).pipe(
      delay(0),
      tap(() => this.updatingPaymentsInProgress$.next(false)),
      mergeMap(() => this.refetchState$(state, {
        reSearchPayments: true,
        refetchTotalPaid: true
      })),
    );
  }


  private applyRemoveSalePaymentEvent(event: RemoveSalePaymentEvent, state: SaleState) {
    this.updatingPaymentsInProgress$.next(true);
    return this.saleService.removePayment$(event.saleRef, event.accountingEntryRef).pipe(
      delay(0),
      tap(() => this.updatingPaymentsInProgress$.next(false)),
      mergeMap(() => this.refetchState$(state, {
        reSearchPayments: true,
        refetchTotalPaid: true
      })),
    );
  }

  private setLastUpdatedItem(newState: SaleState, variantRef: WsItemVariantSaleRef): SaleState {
    const items = newState.items;
    const variantIndex = items.findIndex(i => i.variantSale.id === variantRef.id);
    if (variantIndex >= 0) {
      const variantWithPrice = items[variantIndex];
      newState.lastUpdatedVariant = variantWithPrice.variantSale;
      newState.lastUpdatedVariantIndex = variantIndex;
    } else {
      newState.lastUpdatedVariant = null;
      newState.lastUpdatedVariantIndex = null;
    }
    return newState;
  }

  private updateVariantPrice$(variantRef: WsItemVariantSaleRef, property: keyof WsItemVariantSalePriceDetails, value: number)
    : Observable<WsItemVariantSalePriceDetails> {
    switch (property) {
      case 'discountAmount':
        return this.saleService.updateItemVariantSaleDiscountAmount$(variantRef, value);
      case 'discountRatio':
        return this.saleService.updateItemVariantSaleDiscountRatio$(variantRef, value);
      case 'totalVatExclusive':
        return this.saleService.updateItemVariantSaleTotalVatExclusive$(variantRef, value);
      case 'totalVatExclusivePriorDiscount':
        return this.saleService.updateItemVariantSaleTotalVatExclusivePriorDiscount$(variantRef, value);
      case 'totalVatInclusive':
        return this.saleService.updateItemVariantSaleTotalVatInclusive$(variantRef, value);
      case 'unitPriceVatExclusive':
        return this.saleService.updateItemVariantUnitPriceVatExclusive$(variantRef, value);
      case 'quantity':
        return this.saleService.updateItemVariantQuantity$(variantRef, value);
      case 'vatAmount':
        return this.saleService.updateItemVariantSaleVatAmount$(variantRef, value);
      case 'vatRate':
        return this.saleService.updateItemVariantSaleVatRate$(variantRef, value);
      default:
        throw new Error('Unsupported variant price update property: ' + property);
    }
  }


  private updateSalePrice$(saleRef: WsSaleRef, property: keyof WsSalePriceDetails, value: number)
    : Observable<WsItemVariantSalePriceDetails> {
    switch (property) {
      case 'saleDiscountAmount':
        return this.saleService.updateSaleDiscountAmount$(saleRef, value);
      case 'saleDiscountRatio':
        return this.saleService.updateSaleDiscountRatio$(saleRef, value);
      case 'totalPriceVatInclusive':
        return this.saleService.updateSaleTotalVatInclusive$(saleRef, value);
      default:
        throw new Error('Unsupported sale price update property: ' + property);
    }
  }

}
