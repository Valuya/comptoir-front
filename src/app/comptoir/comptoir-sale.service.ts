import {BehaviorSubject, combineLatest, concat, forkJoin, merge, Observable, of, Subject, Subscription} from 'rxjs';
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
  WsSaleRef, WsSaleSearch
} from '@valuya/comptoir-ws-api';
import {concatMap, delay, filter, map, mergeMap, publishReplay, refCount, switchMap, take, tap, withLatestFrom} from 'rxjs/operators';
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
import {SaleVariantUpdate} from './sale-variant-update';
import {ComptoirSaleEventsService, SaleAccountingEntriesUpdateEvent, SaleItemupdateEvent} from './comptoir-sale-events.service';
import {Injectable} from '@angular/core';
import {AccountingService} from '../domain/accounting/accounting.service';

@Injectable({
  providedIn: 'root'
})
export class ComptoirSaleService {

  // Sale source, emitting when active sale is changed only
  private activeSaleSource$ = new BehaviorSubject<WsSale>(null);

  // Server sent update events
  private serverEventEnabled = false;
  private saleUpdateEvents$: Observable<WsSale>;
  private saleTotalPaidEvents$: Observable<number>;
  private saleItemUpdateEvents$: Observable<SaleItemupdateEvent>;
  private salePaymentEntriesEvents$: Observable<SaleAccountingEntriesUpdateEvent>;

  // Queue of sale updates to apply
  private saleUpdatesSource$ = new Subject<Partial<WsSale>>();
  private updatingSaleInProgress$ = new BehaviorSubject<boolean>(false);
  // Queue of sale items to add
  private addVariantSource$ = new Subject<WsItemVariantRef>();
  private addingItemInProgress$ = new BehaviorSubject<boolean>(false);
  // Queue of sale items to remove
  private removeVariantSource$ = new Subject<WsItemVariantSaleRef>();
  private removingVariantInProgress$ = new BehaviorSubject<boolean>(false);
  // Queue of item updates to apply
  private updateVariantSource$ = new Subject<Partial<SaleVariantUpdate>>();
  private updatingItemInProgress$ = new BehaviorSubject<boolean>(false);
  // Queue of accounting entries to add
  private addAccountingEntrySource$ = new Subject<WsAccountingEntry>();
  private addingAccountingEntriesInProgress$ = new BehaviorSubject<boolean>(false);
  // Queue of accounting entries to remove
  private removeAccountingEntrySource$ = new Subject<WsAccountingEntryRef>();
  private removingAccountingEntriesInProgress$ = new BehaviorSubject<boolean>(false);

  // Trigger to refresh sale and items
  private reloadSource$ = new Subject<boolean>();

  // Updated sale values, emitting whenever a value has been refetched
  private nonCachedUpdatedSale$: Observable<WsSale>;
  private updatedSale$: Observable<WsSale>;
  private saleRef$: Observable<WsSale>;
  private saleTotalPaid$: Observable<number>;
  private saleRemaining$: Observable<number>;
  private saleItemsTableHelper: ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch>;
  private saleAccountingEntriessTableHelper: ShellTableHelper<WsAccountingEntry, WsAccountingEntrySearch>;

  // Cache a page of variant for each item, to be used by the item-and-variant-select in the fill view
  private itemVariantsCaches: { [itemId: number]: SimpleSearchResultResourceCache<WsItemVariantRef> } = {};
  // Cache a page of variant for each item, to be used by the item-and-variant-select in the fill view
  private openSalesCaches: SimpleSearchResultResourceCache<WsSaleRef>;
  private openSales$: Observable<SearchResult<WsSaleRef>>;

  constructor(
    private saleService: SaleService,
    private itemService: ItemService,
    private accountingService: AccountingService,
    private localeService: LocaleService,
    private authService: AuthService,
    private saleEventsService: ComptoirSaleEventsService
  ) {
    // The most recent sale on which to apply further updates
    const effectiveEditingSale$: Observable<WsSale> = this.activeSaleSource$.pipe(
      filter(s => s != null),
      switchMap(initSale => this.concatInitSaleAndItsUpdates$(initSale)),
      publishReplay(0), refCount()
    );

    // Each source of updates is applied - using concatMap to process them all in order
    // FIXME: there might still be unordered actions processed- as adding/updating/removing actions are
    // treated in parrallel queues
    const saleUpdated$ = this.saleUpdatesSource$.pipe(
      concatMap(update => this.applyNextSaleUpdate$(update, effectiveEditingSale$)),
    );
    const itemAdded$ = this.addVariantSource$.pipe(
      concatMap(variantRef => this.addNextVariant$(variantRef, effectiveEditingSale$)),
    );
    const itemRemoved$ = this.removeVariantSource$.pipe(
      concatMap(ref => this.removeNextVariant$(ref)),
    );
    const itemUpdated$ = this.updateVariantSource$.pipe(
      concatMap(variantUpdate => this.applyNextVariantUpdate$(variantUpdate, effectiveEditingSale$)),
    );
    const accountingEntryAdded$ = this.addAccountingEntrySource$.pipe(
      concatMap(entry => this.addNextAccountingEntry$(entry, effectiveEditingSale$)),
    );
    const accountingEntryRemoved$ = this.removeAccountingEntrySource$.pipe(
      concatMap(ref => this.removeNextAccountingEntry$(ref, effectiveEditingSale$)),
    );

    this.nonCachedUpdatedSale$ = merge(
      saleUpdated$, this.activeSaleSource$,
      itemAdded$, itemUpdated$, itemRemoved$,
      accountingEntryAdded$, accountingEntryRemoved$
    ).pipe(
      // TODO: when polling server on each update, we may optimize further: no need to refetch everything for each of
      // those events
      concatMap(r => this.refreshSalePostUpades$()),
      publishReplay(0), refCount()
    );
    // Assumes server pushes updates, except for reloads
    const reloaded$ = this.reloadSource$.pipe(
      switchMap(sale => this.reloadSaleAndItems$())
    );

    this.updatedSale$ = merge(effectiveEditingSale$, this.nonCachedUpdatedSale$, reloaded$).pipe(
      publishReplay(1), refCount()
    );
    this.saleTotalPaid$ = this.nonCachedUpdatedSale$.pipe(
      switchMap(sale => this.getSaleTotalPaid(sale)),
      publishReplay(1), refCount()
    );

    this.saleRef$ = this.activeSaleSource$.pipe(
      map(s => s == null || s.id == null ? null : {id: s.id}),
      publishReplay(1), refCount()
    );

    this.saleRemaining$ = combineLatest(this.updatedSale$, this.saleTotalPaid$).pipe(
      map(results => this.getSaleAmountRemaining(results[0], results[1])),
      publishReplay(1), refCount()
    );

    this.saleItemsTableHelper = new ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch>(
      (searchFilter, pagination) => this.getSaleItemEventResults$(searchFilter),
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
    this.openSales$ = this.openSalesCaches.getResults$().pipe(
      publishReplay(1), refCount()
    );

  }


  subscribeToServerEvents$(): Subscription {
    // Dont miss any event
    this.saleUpdateEvents$ = this.saleEventsService.getUpdates$().pipe(
      tap(sale => this.saleService.cacheSale(sale)),
      publishReplay(1), refCount()
    );
    this.saleTotalPaidEvents$ = this.saleEventsService.getSaleTotalPaidUpdates$().pipe(
      publishReplay(1), refCount()
    );
    this.saleItemUpdateEvents$ = this.saleEventsService.getItemsUpdates$().pipe(
      tap(event => this.saleService.cacheSaleItems(event.results)),
      publishReplay(1), refCount()
    );
    this.salePaymentEntriesEvents$ = this.saleEventsService.getPaymentEntriesUpdates().pipe(
      tap(event => this.accountingService.cacheEntries(event.results)),
      publishReplay(1), refCount()
    );

    this.serverEventEnabled = true;

    // Dont miss any event by subscribing early
    const subscription = new Subscription();
    const saleUpdateSubscription = this.saleUpdateEvents$.subscribe();
    const saleItemsSubscription = this.saleItemUpdateEvents$.subscribe();
    const saleTotalPaidSubscription = this.saleTotalPaidEvents$.subscribe();
    const salePaymentEntriesSubscription = this.salePaymentEntriesEvents$.subscribe();
    subscription.add(saleUpdateSubscription);
    subscription.add(saleItemsSubscription);
    subscription.add(saleTotalPaidSubscription);
    subscription.add(salePaymentEntriesSubscription);
    subscription.add(() => {
      this.saleEventsService.unsubscribe();
    });
    return subscription;
  }

  initSale(sale: WsSale) {
    if (sale == null) {
      throw new Error('No sale');
    }
    this.activeSaleSource$.next(sale);

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
          accountType: WsBalanceSearchAccountSearchAccountTypeEnum.PAYMENT
        }
      });
      if (this.serverEventEnabled) {
        this.saleEventsService.subscribeToSale({id: sale.id});
      }
    }
  }

  updateSale(update: Partial<WsSale>) {
    this.saleUpdatesSource$.next(update);
  }

  addVariant(ref: WsItemVariantRef) {
    this.addVariantSource$.next(ref);
  }

  removeVariant(ref: WsItemVariantSaleRef) {
    this.removeVariantSource$.next(ref);
  }

  udpdateSaleVariant(ref: WsItemVariantSaleRef, partialUpdate: Partial<WsItemVariantSale>) {
    this.updateVariantSource$.next({
      variantRef: ref,
      update: partialUpdate
    });
  }

  addTransaction(newEntry: WsAccountingEntry) {
    this.addAccountingEntrySource$.next(newEntry);
  }

  removeTransaction(ref: WsAccountingEntryRef) {
    this.removeAccountingEntrySource$.next(ref);
  }

  refresh() {
    this.reloadSource$.next(true);
  }

  getSale$(): Observable<WsSale> {
    return this.updatedSale$;
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
    return this.openSales$;
  }

  closeActiveSale$(): Observable<any> {
    return this.getSaleRef$().pipe(
      take(1),
      switchMap(ref => this.saleService.closeSale$(ref)),
      tap(() => this.openSalesCaches.refetch())
    );
  }

  reopenActiveSale$(): Observable<WsSaleRef> {
    return this.getSaleRef$().pipe(
      take(1),
      switchMap(ref => this.saleService.openSale$(ref)),
      tap(() => this.openSalesCaches.refetch()),
      switchMap(ref => this.saleService.getSale$(ref)),
      tap(sale => this.initSale(sale)),
    );
  }

  private applyNextSaleUpdate$(update: Partial<WsSale>, effectiveSale$: Observable<WsSale>): Observable<WsSaleRef> {
    this.updatingSaleInProgress$.next(true);
    return effectiveSale$.pipe(
      take(1),
      map(curSale => Object.assign({}, curSale, update) as WsSale),
      mergeMap(updatedSale => this.saleService.saveSale(updatedSale)),
      delay(0),
      tap(() => this.updatingSaleInProgress$.next(false))
    );
  }

  private addNextVariant$(ref: WsItemVariantRef, curSale$: Observable<WsSale>): Observable<WsItemVariantSaleRef> {
    this.addingItemInProgress$.next(true);
    return forkJoin(
      curSale$.pipe(take(1)),
      this.saleItemsTableHelper.rows$.pipe(take(1))
    ).pipe(
      mergeMap(results => this.addOrAppendVariant$(results[0], results[1], ref)),
      delay(0),
      tap(() => this.addingItemInProgress$.next(false)),
    );
  }

  private removeNextVariant$(ref: WsItemVariantSaleRef): Observable<any> {
    this.removingVariantInProgress$.next(true);
    return this.saleService.removeVariant(ref).pipe(
      delay(0),
      tap(() => this.removingVariantInProgress$.next(false)),
    );
  }

  private applyNextVariantUpdate$(variantUpdate: Partial<SaleVariantUpdate>, effectiveEditingSale$: Observable<WsSale>)
    : Observable<WsItemVariantSaleRef> {
    const variantRef = variantUpdate.variantRef;
    const variantPartialUpdate = variantUpdate.update;

    this.updatingItemInProgress$.next(true);
    return this.searchCurrentVariant$(variantRef, effectiveEditingSale$).pipe(
      map(curVariant => Object.assign({}, curVariant, variantPartialUpdate) as WsItemVariantSale),
      mergeMap(updatedVariant => this.saleService.saveVariant(updatedVariant)),
      delay(0),
      tap(() => this.updatingItemInProgress$.next(false))
    );
  }

  private addNextAccountingEntry$(entry: WsAccountingEntry, effectiveEditingSale$: Observable<WsSale>)
    : Observable<WsAccountingEntryRef> {
    this.addingAccountingEntriesInProgress$.next(true);
    return effectiveEditingSale$.pipe(
      take(1),
      mergeMap(sale => this.saleService.addPayment$({id: sale.id}, entry)),
      delay(0),
      tap(() => this.addingAccountingEntriesInProgress$.next(false))
    );
  }

  private removeNextAccountingEntry$(ref: WsAccountingEntryRef, effectiveEditingSale$: Observable<WsSale>): Observable<any> {
    this.removingAccountingEntriesInProgress$.next(true);
    return effectiveEditingSale$.pipe(
      take(1),
      mergeMap(sale => this.saleService.removePayment$({id: sale.id}, ref)),
      delay(0),
      tap(() => this.removingAccountingEntriesInProgress$.next(false)),
    );
  }

  private searchSaleItems$(searchFilter: WsItemVariantSaleSearch, pagination: Pagination): Observable<SearchResult<WsItemVariantSale>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    const sale$ = this.activeSaleSource$.pipe(take(1));
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
      saleRef: {id: sale.id},
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
    return this.saleService.createSale$(sale).pipe(
      switchMap(newSaleRef => this.saleService.getSale$(newSaleRef)),
      tap(newSale => this.initSale(newSale)),
      tap(newSale => this.openSalesCaches.invalidate()),
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

  private getSaleTotalPaid(ref: WsSaleRef): Observable<number> {
    if (ref == null || ref.id == null) {
      return of(0);
    }
    const reloaded$ = this.reloadSource$.pipe(
      switchMap(() => this.saleService.getSaleTotalPaid$(ref))
    );
    if (this.saleTotalPaidEvents$ != null) {
      return merge(
        reloaded$,
        this.saleTotalPaidEvents$
      );
    } else {
      return merge(
        reloaded$,
        this.saleService.getSaleTotalPaid$(ref)
      );
    }
  }

  private concatInitSaleAndItsUpdates$(initSale: WsSale): Observable<WsSale> {
    if (initSale.id == null) {
      return of(initSale);
    }

    if (this.saleUpdateEvents$ != null) {
      const saleUpdates$ = this.saleUpdateEvents$.pipe(
        filter(update => update.id === initSale.id),
      );
      return concat(
        of(initSale),
        saleUpdates$,
      );
    } else {
      if (this.nonCachedUpdatedSale$ == null) {
        throw new Error('No sale update observable setup when expected');
      }
      return concat(
        of(initSale),
        this.nonCachedUpdatedSale$
      );
    }
  }

  private searchCurrentVariant$(variantRef: WsItemVariantSaleRef, effectiveEditingSale$: Observable<WsSale>) {
    // get it from the sale service cache rather than this table helper
    return this.saleService.getVariant$(variantRef);
  }

  private getSaleItemEventResults$(searchFilter: WsItemVariantSaleSearch)
    : Observable<SearchResult<WsItemVariantSale>> {
    const emptyResults$ = of(SearchResultFactory.emptyResults());
    if (searchFilter == null) {
      return emptyResults$;
    }

    if (this.saleItemUpdateEvents$ != null) {
      const resultsFromEvent$ = this.saleItemUpdateEvents$.pipe(
        filter(event => event.saleRef.id === searchFilter.saleRef.id),
        map(event => event.results),
      );
      const eventResults$ = concat(
        emptyResults$,
        resultsFromEvent$,
      );
      const reloadedResults$ = this.reloadSource$.pipe(
        switchMap(() => this.searchSaleItems$(searchFilter, PaginationUtils.create(100)))
      );
      return merge(eventResults$, reloadedResults$);
    } else {
      const restResults$ = this.searchSaleItems$(searchFilter, PaginationUtils.create(100));
      return restResults$;
    }

  }

  private getSaleAccountingEntries$(searchFilter: WsAccountingEntrySearch)
    : Observable<SearchResult<WsAccountingEntry>> {
    const emptyResults$ = of(SearchResultFactory.emptyResults<WsAccountingEntry>());

    if (searchFilter == null) {
      return emptyResults$;
    }

    if (this.salePaymentEntriesEvents$ != null) {
      const resultsFromEvent$ = this.salePaymentEntriesEvents$.pipe(
        filter(event => event.transactionRef.id === searchFilter.accountingTransactionRef.id),
        map(event => event.results),
      );
      const eventResults$ = concat(
        emptyResults$,
        resultsFromEvent$,
      );
      const reloadedResults$ = this.reloadSource$.pipe(
        switchMap(() => this.searchSaleAccountingEntries$(searchFilter, PaginationUtils.create(100)))
      );
      return merge(eventResults$, reloadedResults$);
    } else {
      const restResults$ = this.searchSaleAccountingEntries$(searchFilter, PaginationUtils.create(100));
      return restResults$;
    }
  }


  private refreshSalePostUpades$(): Observable<WsSale> {
    if (this.saleUpdateEvents$ == null) {
      return this.reloadSaleAndItems$();
    } else {
      return this.saleUpdateEvents$.pipe(
        withLatestFrom(this.activeSaleSource$),
        // Check it is for the actual sale
        filter(r => r[0].id === r[1].id),
        map(r => r[0])
      );
    }
  }

  private reloadSaleAndItems$() {
    return this.activeSaleSource$.pipe(
      filter(s => s != null && s.id != null),
      take(1),
      map(curSale => {
        this.initSale(curSale);
        return curSale;
      })
    );
  }

  private getSaleAmountRemaining(sale: WsSale, paid: number) {
    return sale.vatExclusiveAmount + sale.vatAmount - paid;
  }


  private searchOpenSales$(): Observable<SearchResult<WsSaleRef>> {
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      map(r => this.createSearchFilter(r)),
      switchMap(searchFilter => this.saleService.searchSales$(searchFilter, PaginationUtils.create(10)))
    );
  }

  private createSearchFilter(companyRef: WsCompanyRef | null): WsSaleSearch {
    if (companyRef == null) {
      return null;
    }
    return {
      closed: false,
      companyRef: companyRef as object,
    };
  }
}
