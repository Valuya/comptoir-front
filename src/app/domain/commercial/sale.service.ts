import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {
  WsItemVariantSale,
  WsItemVariantSaleRef,
  WsSale,
  WsSaleRef
} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {ItemService} from './item.service';
import {CachedResourceClient} from '../util/cache/cached-resource-client';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  private saleCache: CachedResourceClient<WsSaleRef, WsSale>;
  private variantCache: CachedResourceClient<WsItemVariantSaleRef, WsSaleRef>;

  constructor(
    private apiService: ApiService,
    private itemService: ItemService,
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


  createSale$(sale: WsSale): Observable<WsSaleRef> {
    return this.saleCache.createResource$(sale);
  }

  getSale$(ref: WsSaleRef): Observable<WsSale> {
    return this.saleCache.getResource$(ref);
  }

  getVariant$(ref: WsItemVariantSaleRef): Observable<WsItemVariantSale> {
    return this.variantCache.getResource$(ref);
  }

  createNewSaleItem$(curSale: WsSale, itemToAdd: WsItemVariantSaleRef): Observable<WsItemVariantSaleRef> {
    const variant: WsItemVariantSale = {
      saleRef: {id: curSale.id},
      dateTime: new Date(),
      itemVariantRef: itemToAdd,
      quantity: 1,
      vatExclusive: 0,
      vatRate: 0,
    };
    return this.variantCache.createResource$(variant);
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


  private doGet$(ref: WsSaleRef) {
    return this.apiService.api.getSale({
      id: ref.id
    }) as any as Observable<WsSale>;
  }


  private doPut$(val: WsSale) {
    return this.apiService.api.updateSale({
      id: val.id,
      wsSale: val
    }) as any as Observable<WsItemVariantSaleRef>;
  }

  private doCreate$(val: WsSaleRef) {
    return this.apiService.api.createSale({
      wsSale: val
    }) as any as Observable<WsItemVariantSaleRef>;
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

}
