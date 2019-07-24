import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {WsItem, WsItemRef, WsItemVariant, WsItemVariantRef, WsItemVariantSale, WsSale, WsSaleRef} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {CachedResourceClient} from '../util/cache/cached-resource-client';

@Injectable({
  providedIn: 'root'
})
export class ItemService {


  private itemCache: CachedResourceClient<WsItemRef, WsItem>;
  private variantCache: CachedResourceClient<WsItemVariantRef, WsItemRef>;

  constructor(
    private apiService: ApiService
  ) {
    this.itemCache = new CachedResourceClient<WsItemRef, WsItem>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      ref => this.doDelete$(ref),
    );
    this.variantCache = new CachedResourceClient<WsItemVariantRef, WsItemVariant>(
      ref => this.doGetVariant$(ref),
      val => this.doPutVariant$(val),
      val => this.doCreateVariant$(val),
      ref => this.doDeleteVariant$(ref),
    );
  }


  getItem$(ref: WsItemRef): Observable<WsItem> {
    return this.itemCache.getResource$(ref);
  }


  getItemVariant$(ref: WsItemVariantRef): Observable<WsItemVariant> {
    return this.variantCache.getResource$(ref);
  }

  private doGet$(ref: WsItemRef) {
    return this.apiService.api.getItem({
      id: ref.id
    }) as any as Observable<WsItem>;
  }


  private doPut$(val: WsItem) {
    return this.apiService.api.updateItem({
      id: val.id,
      wsItem: val
    }) as any as Observable<WsItemRef>;
  }

  private doCreate$(val: WsItem) {
    return this.apiService.api.createItem({
      wsItem: val
    }) as any as Observable<WsItemRef>;
  }

  private doDelete$(ref: WsItemRef) {
    return this.apiService.api.deleteItem({
      id: ref.id
    }) as any as Observable<WsItemRef>;
  }

  private doGetVariant$(ref: WsItemVariantRef) {
    return this.apiService.api.getItemVariant({
      id: ref.id
    }) as any as Observable<WsItemVariant>;
  }


  private doPutVariant$(val: WsItemVariant) {
    return this.apiService.api.updateItemVariant({
      id: val.id,
      wsItemVariant: val
    }) as any as Observable<WsItemVariantRef>;
  }

  private doCreateVariant$(val: WsItemVariant) {
    return this.apiService.api.createItemVariant({
      wsItemVariant: val
    }) as any as Observable<WsItemVariantRef>;
  }

  private doDeleteVariant$(ref: WsItemVariantRef) {
    return this.apiService.api.deleteItemVariant({
      id: ref.id
    }) as any as Observable<WsItemVariantRef>;
  }
}
