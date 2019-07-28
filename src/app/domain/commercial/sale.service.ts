import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {
  WsAccountingEntry,
  WsAccountingEntryRef,
  WsBalance, WsBalanceRef, WsItem, WsItemVariant,
  WsItemVariantSale,
  WsItemVariantSaleRef, WsItemVariantSaleSearch, WsItemVariantSaleSearchResult,
  WsSale,
  WsSaleRef, WsSaleSearch, WsSalesSearchResult
} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {map, mergeMap, switchMap} from 'rxjs/operators';
import {ItemService} from './item.service';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {Pagination} from '../../util/pagination';
import {PaginationUtils} from '../../util/pagination-utils';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {PricingUtils} from '../util/pricing-utils';
import {AccountingService} from '../accounting/accounting.service';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private saleCache: CachedResourceClient<WsSaleRef, WsSale>;
  private variantCache: CachedResourceClient<WsItemVariantSaleRef, WsSaleRef>;

  constructor(
    private apiService: ApiService,
    private itemService: ItemService,
    private accountingService: AccountingService,
  ) {
    this.saleCache = new CachedResourceClient<WsSaleRef, WsSale>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      ref => this.doDelete$(ref),
    );
    this.variantCache = new CachedResourceClient<WsItemVariantSaleRef, WsItemVariantSale>(
      ref => this.doGetVariant$(ref),
      val => this.doPutVariant$(val),
      val => this.doCreateVariant$(val),
      ref => this.doDeleteVariant$(ref),
    );
  }

  addPayment$(saleRef: WsSaleRef, entry: WsAccountingEntry): Observable<WsAccountingEntryRef> {
    return this.apiService.api.addSalePayment({
      id: saleRef.id,
      wsAccountingEntry: entry
    }) as any as Observable<WsAccountingEntryRef>;
  }

  removePayment$(saleRef: WsSaleRef, ref: WsAccountingEntryRef): Observable<any> {
    this.accountingService.clearCachedEntry(ref);
    return this.apiService.api.deleteSalePayment({
      id: saleRef.id,
      entryId: ref.id
    }) as any as Observable<any>;
  }

  createSale$(sale: WsSale): Observable<WsSaleRef> {
    return this.saleCache.createResource$(sale);
  }

  getSale$(ref: WsSaleRef, forceFetch?: boolean): Observable<WsSale> {
    if (ref == null) {
      return of(null);
    }
    if (forceFetch) {
      this.saleCache.clearCache(ref);
    }
    return this.saleCache.getResource$(ref);
  }

  getSaleTotalPaid$(ref: WsSaleRef): Observable<number> {
    if (ref == null) {
      return of(0);
    }
    const totalString$ = this.apiService.api.getSaleTotalPayed({
      id: ref.id
    }) as any as Observable<string>;
    return totalString$.pipe(
      map(stringValue => parseFloat(stringValue))
    );
  }

  getVariant$(ref: WsItemVariantSaleRef, forceFetch?: boolean): Observable<WsItemVariantSale> {
    if (forceFetch) {
      this.variantCache.clearCache(ref);
    }
    return this.variantCache.getResource$(ref);
  }

  saveSale(sale: WsSale): Observable<WsSaleRef> {
    if (sale.id == null) {
      return this.saleCache.createResource$(sale);
    } else {
      return this.saleCache.updateResource$(sale);
    }
  }

  saveVariant(variant: WsItemVariantSale): Observable<WsItemVariantSaleRef> {
    if (variant.id == null) {
      return this.variantCache.createResource$(variant);
    } else {
      return this.variantCache.updateResource$(variant);
    }
  }

  removeVariant(variantRef: WsItemVariantSaleRef): Observable<any> {
    return this.variantCache.deleteResource$(variantRef);
  }

  searchSales$(searchFilter: WsSaleSearch, pagination: Pagination): Observable<WsSalesSearchResult> {
    const searchResult$ = this.apiService.api.findSales({
      offset: pagination.first,
      length: pagination.rows,
      sort: PaginationUtils.sortMetaToQueryParam(pagination.multiSortMeta),
      wsSaleSearch: searchFilter
    }) as any as Observable<WsSalesSearchResult>;
    return searchResult$;
  }

  searchVariants$(searchFilter: WsItemVariantSaleSearch, pagination: Pagination): Observable<WsItemVariantSaleSearchResult> {
    const searchResult$ = this.apiService.api.searchItemVariantSales({
      offset: pagination.first,
      length: pagination.rows,
      sort: PaginationUtils.sortMetaToQueryParam(pagination.multiSortMeta),
      wsItemVariantSaleSearch: searchFilter
    }) as any as Observable<WsItemVariantSaleSearchResult>;
    return searchResult$;
  }

  createNewSaleItem$(curSale: WsSale, itemToAdd: WsItemVariantSaleRef): Observable<WsItemVariantSaleRef> {
    return this.itemService.getItemVariant$(itemToAdd).pipe(
      mergeMap(itemVariant => this.createNewSaleItemVariant$(curSale, itemVariant))
    );
  }

  isMultipleSale$(variantRef: WsItemVariantSaleRef): Observable<boolean> {
    return this.itemService.getItemVariant$(variantRef).pipe(
      switchMap(variant => this.itemService.getItem$(variant.itemRef)),
      map(item => item.multipleSale)
    );
  }

  appendToExistingItem$(existingItem: WsItemVariantSale, amount: number): Observable<WsItemVariantSaleRef> {
    const curQuantity = existingItem.quantity;
    return this.updateQuantity$({id: existingItem.id}, curQuantity + amount);
  }

  updateQuantity$(variantRef: WsItemVariantSaleRef, quantityValue: number): Observable<WsItemVariantSaleRef> {
    return this.getVariant$(variantRef).pipe(
      switchMap(variant => this.updateVariant$(variant, {
        quantity: quantityValue
      })),
    );
  }

  updateVariant$(variant: WsItemVariantSale, updates?: Partial<WsItemVariantSale>) {
    const newVariant = Object.assign({}, variant, updates);
    return this.variantCache.updateResource$(newVariant);
  }


  cacheSale(sale: WsSale) {
    this.saleCache.setCachedValue(sale);
  }

  cacheSaleItems(results: SearchResult<WsItemVariantSale>) {
    results.list.forEach(
      variant => this.variantCache.setCachedValue(variant)
    );
  }

  private doGet$(ref: WsSaleRef) {
    return this.apiService.api.getSale({
      id: ref.id
    }) as any as Observable<WsSale>;
  }


  private doPut$(val: WsSale) {
    return this.apiService.api.updateSale({
      id: val.id,
      wsSale: val
    }) as any as Observable<WsSaleRef>;
  }

  private doCreate$(val: WsSale) {
    return this.apiService.api.createSale({
      wsSale: val
    }) as any as Observable<WsSaleRef>;
  }

  private doDelete$(ref: WsSaleRef) {
    return this.apiService.api.deleteSale({
      id: ref.id
    }) as any as Observable<WsSaleRef>;
  }

  private doGetVariant$(ref: WsItemVariantSaleRef) {
    return this.apiService.api.getItemVariantSale({
      id: ref.id
    }) as any as Observable<WsItemVariantSale>;
  }


  private doPutVariant$(val: WsItemVariantSale) {
    return this.apiService.api.updateItemVariantSale({
      id: val.id,
      wsItemVariantSale: val
    }) as any as Observable<WsItemVariantSaleRef>;
  }

  private doCreateVariant$(val: WsItemVariantSale) {
    return this.apiService.api.createItemVariantSale({
      wsItemVariantSale: val
    }) as any as Observable<WsItemVariantSaleRef>;
  }

  private doDeleteVariant$(ref: WsItemVariantSaleRef) {
    return this.apiService.api.deleteItemVariantSale({
      id: ref.id
    }) as any as Observable<WsItemVariantSaleRef>;
  }

  private createNewSaleItemVariant$(curSale: WsSale, itemVariant: WsItemVariant) {
    return this.itemService.getItem$(itemVariant.itemRef).pipe(
      mergeMap(item => this.createNewSaleItemVariantWithItem$(curSale, item, itemVariant))
    );

  }

  private createNewSaleItemVariantWithItem$(curSale: WsSale, item: WsItem, itemVariant: WsItemVariant) {
    const vatExclusive = item.vatExclusive;
    const variantPricing = itemVariant.pricing;
    const pricingAmount = itemVariant.pricingAmount;
    const variantPrice = PricingUtils.applyPricing(vatExclusive, variantPricing, pricingAmount);
    const itemVatRate = item.vatRate;
    const variant: WsItemVariantSale = {
      saleRef: {id: curSale.id},
      dateTime: new Date(),
      itemVariantRef: {id: itemVariant.id},
      quantity: 1,
      vatExclusive: variantPrice,
      vatRate: itemVatRate,
    };
    return this.variantCache.createResource$(variant);
  }
}
