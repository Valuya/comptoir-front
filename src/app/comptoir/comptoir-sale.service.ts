import {BehaviorSubject, combineLatest, EMPTY, forkJoin, merge, Observable, of, Subject} from 'rxjs';
import {
  WsAccountingEntry,
  WsAccountingEntryRef,
  WsAccountingEntrySearch,
  WsBalanceSearchAccountSearchAccountTypeEnum,
  WsCompanyRef,
  WsItemRef,
  WsItemVariantRef,
  WsItemVariantSale,
  WsItemVariantSaleRef,
  WsItemVariantSaleSearch,
  WsItemVariantSaleSearchResult,
  WsItemVariantSearch,
  WsSale,
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
  private saleRef$: Observable<WsSale | null>;
  private saleTotalPaid$: Observable<number | null>;
  private saleRemaining$: Observable<number | null>;
  // Tables helpers are used for lists to allow easy sorting/filtering
  private saleItemsTableHelper: ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch>;
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
    this.saleItemsTableHelper = new ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch>(
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
    this.saleTotalPaid$ = this.saleState$.pipe(
      map(state => state == null ? null : state.totalPaid),
      publishReplay(1), refCount()
    );

    this.saleRef$ = this.activeSaleSource$.pipe(
      map(s => s == null || s.id == null ? null : {id: s.id}),
      publishReplay(1), refCount()
    );

    this.saleRemaining$ = combineLatest(this.sale$, this.saleTotalPaid$).pipe(
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
          accountType: WsBalanceSearchAccountSearchAccountTypeEnum.PAYMENT,
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

  getItemsTableHelper(): ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch> {
    return this.saleItemsTableHelper;
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
    );
  }

  cancelSale$(): Observable<WsSaleRef> {
    return this.getSaleRef$().pipe(
      take(1),
      switchMap(ref => this.saleService.cancelSale$(ref)),
      tap(() => this.activeSaleSource$.next(null)),
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
    : Observable<SearchResult<WsItemVariantSale>> {
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
      ref => this.saleService.getVariant$(ref),
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


  private searchSaleItems$(searchFilter: WsItemVariantSaleSearch)
    : Observable<SearchResult<WsItemVariantSale>> {
    const emptyResults$ = of(SearchResultFactory.emptyResults());
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

  private getSaleAmountRemaining(sale: WsSale, paid: number) {
    if (sale == null || paid == null) {
      return 0;
    }
    return sale.vatExclusiveAmount + sale.vatAmount - paid;
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
    const seedState = this.createSaleState(sale, [], 0, []);
    if (sale.id == null) {
      return of(seedState);
    }
    const initState$ = this.refetchState$(seedState, {
      refetchTotalPaid: true,
      refetchPayments: true,
      refetchItems: true
    });
    const nextStates$ = this.saleEventsSource$.pipe(
      // tap(e => console.log('event on ' + e.saleRef.id)),
      concatMap(event => this.applySaleEvent$(event))
    );
    return merge(initState$, nextStates$);
  }

  private refetchState$(state: SaleState, options?: {
    refetchSale?: boolean,
    refetchItems?: boolean,
    refetchTotalPaid?: boolean,
    refetchPayments?: boolean,
  }): Observable<SaleState> {
    const saleId = state.sale.id;
    if (saleId == null) {
      return of(state);
    }
    const nonNullOptions = options || {};

    const sale$ = nonNullOptions.refetchSale ? this.saleService.getSale$({id: saleId}, true) : of(state.sale);
    const saleItems$ = nonNullOptions.refetchItems ? this.saleItemsTableHelper.reload() : of(state.items);
    const totalPaid$ = nonNullOptions.refetchTotalPaid ? this.saleService.getSaleTotalPaid$({id: saleId}) : of(state.totalPaid);
    const paymentItems$ = nonNullOptions.refetchPayments ? this.saleAccountingEntriessTableHelper.reload() : of(state.paymentItems);

    this.updatingSaleInProgress$.next(true);
    this.updatingItemsInProgress$.next(true);
    this.updatingPaymentsInProgress$.next(true);
    return combineLatest(sale$, saleItems$, totalPaid$, paymentItems$).pipe(
      map(r => this.createSaleState(r[0], r[1], r[2], r[3])),
      delay(0),
      tap(() => {
        this.updatingSaleInProgress$.next(false);
        this.updatingItemsInProgress$.next(false);
        this.updatingPaymentsInProgress$.next(false);
      })
    );
  }

  private createSaleState(saleValue: WsSale, itemsValue: WsItemVariantSale[],
                          totalPaidValue: number, paymentsValue: WsAccountingEntry[]): SaleState {
    return {
      sale: saleValue,
      items: itemsValue,
      totalPaid: totalPaidValue,
      paymentItems: paymentsValue
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
      case SaleEventType.ADD_ITEM_VARIANT:
        updatedState$ = this.applyAddItemVariantEvent$(event as AddItemVariantEvent, state);
        break;
      case SaleEventType.REMOVE_SALE_VARIANT:
        updatedState$ = this.applyRemoveSaleVariantEvent$(event as RemoveSaleVariantEvent, state);
        break;
      case SaleEventType.UPDATE_SALE_VARIANT:
        updatedState$ = this.applyUpdateSaleVariantEvent$(event as UpdateSaleVariantEvent<any>, state);
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

  private applyAddItemVariantEvent$(event: AddItemVariantEvent, state: SaleState) {
    this.updatingItemsInProgress$.next(true);
    return this.addOrAppendVariant$(state.sale, state.items, event.variantRef).pipe(
      delay(0),
      tap(() => this.updatingItemsInProgress$.next(false)),
      mergeMap(() => this.refetchState$(state, {
        refetchSale: true,
        refetchItems: true
      })),
    );
  }

  private applyRemoveSaleVariantEvent$(event: RemoveSaleVariantEvent, state: SaleState) {
    const variantRef = event.saleVariantRef;
    this.updatingItemsInProgress$.next(true);
    return this.saleService.removeVariant(variantRef).pipe(
      delay(0),
      tap(() => this.updatingItemsInProgress$.next(false)),
      mergeMap(() => this.refetchState$(state, {
        refetchSale: true,
        refetchItems: true
      })),
    );
  }

  private applyUpdateSaleVariantEvent$(event: UpdateSaleVariantEvent<any>, state: SaleState) {
    const variantRef = event.variantRef;
    const curVariant = state.items.find(i => i.id === variantRef.id);
    const variantToUpdate = Object.assign({}, curVariant, event.update);

    this.updatingItemsInProgress$.next(true);
    return this.saleService.saveVariant(variantToUpdate).pipe(
      delay(0),
      tap(() => this.updatingItemsInProgress$.next(false)),
      mergeMap(() => this.refetchState$(state, {
        refetchSale: true,
        refetchItems: true
      })),
    );
  }

  private applyAddSalePaymentEvent(event: AddSalePaymentEvent, state: SaleState) {
    this.updatingPaymentsInProgress$.next(true);
    return this.saleService.addPayment$(event.saleRef, event.entry).pipe(
      delay(0),
      tap(() => this.updatingPaymentsInProgress$.next(false)),
      mergeMap(() => this.refetchState$(state, {
        refetchPayments: true,
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
        refetchPayments: true,
        refetchTotalPaid: true
      })),
    );
  }

}
