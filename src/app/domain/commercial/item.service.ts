import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {
  WsBalance, WsBalanceRef,
  WsItem,
  WsItemRef,
  WsItemSearch,
  WsItemVariant,
  WsItemVariantRef,
  WsItemVariantSearch,
  WsItemVariantSearchResult
} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {Pagination} from '../../util/pagination';
import {PaginationUtils} from '../../util/pagination-utils';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {switchMap} from 'rxjs/operators';

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

  saveItem(item: WsItem): Observable<WsItemRef> {
    if (item.id == null) {
      return this.itemCache.createResource$(item);
    } else {
      return this.itemCache.updateResource$(item);
    }
  }

  saveVariant(variant: WsItemVariant): Observable<WsItemVariant> {
    if (variant.id == null) {
      return this.variantCache.createResource$(variant);
    } else {
      return this.variantCache.updateResource$(variant);
    }
  }

  searchsItems$(searchFilter: WsItemSearch, pagination: Pagination): Observable<SearchResult<WsItemRef>> {
    const searchResult$ = this.apiService.api.findItems({
      offset: pagination.first,
      length: pagination.rows,
      sort: PaginationUtils.sortMetaToQueryParam(pagination.multiSortMeta),
      wsItemSearch: searchFilter
    }) as any as Observable<SearchResult<WsItemRef>>;
    return searchResult$;
  }

  searchVariants$(searchFilter: WsItemVariantSearch, pagination: Pagination): Observable<SearchResult<WsItemVariantRef>> {
    const searchResult$ = this.apiService.api.findItemVariants({
      offset: pagination.first,
      length: pagination.rows,
      sort: PaginationUtils.sortMetaToQueryParam(pagination.multiSortMeta),
      wsItemVariantSearch: searchFilter
    }) as any as Observable<SearchResult<WsItemVariantRef>>;
    return searchResult$;
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
