import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {Observable, throwError} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {
  WsItemVariantStock,
  WsItemVariantStockRef,
  WsItemVariantStockSearch,
  WsStock,
  WsStockRef,
  WsStockSearch,
  WsStockSearchResult
} from '@valuya/comptoir-ws-api';
import {switchMap} from 'rxjs/operators';
import {SearchResult} from '../../app-shell/shell-table/search-result';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  private stockCache: CachedResourceClient<WsStockRef, WsStock>;
  private variantCache: CachedResourceClient<WsItemVariantStockRef, WsItemVariantStock>;

  constructor(
    private apiService: ApiService
  ) {
    this.stockCache = new CachedResourceClient<WsStockRef, WsStock>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
    );
    this.variantCache = new CachedResourceClient<WsStockRef, WsStock>(
      ref => this.doGetVariant$(ref),
      val => throwError('update not nupported'), // this.doPutVaruant$(val),
      val => this.doCreateVariant$(val),
      // ref => this.doDeleteVariant$(ref),
    );
  }

  saveStock(stock: WsStock): Observable<WsStock> {
    if (stock.id == null) {
      return this.stockCache.createResource$(stock).pipe(
        switchMap(ref => this.stockCache.getResource$(ref))
      );
    } else {
      return this.stockCache.updateResource$(stock).pipe(
        switchMap(ref => this.stockCache.getResource$(ref))
      );
    }
  }

  createStockVariant$(item: WsItemVariantStock): Observable<WsItemVariantStock> {
    return this.stockCache.createResource$(item).pipe(
      switchMap(ref => this.stockCache.getResource$(ref))
    );
  }

  getStock$(ref: WsStockRef): Observable<WsStock> {
    return this.stockCache.getResource$(ref);
  }


  getStockVariant$(ref: WsItemVariantStockRef): Observable<WsItemVariantStock> {
    return this.variantCache.getResource$(ref);
  }

  searchStockList$(seachFilter: WsStockSearch, pagination: Pagination): Observable<WsStockSearchResult> {
    return this.apiService.api.searchStocks({
      offset: pagination.first,
      length: pagination.rows,
      wsStockSearch: seachFilter
    }) as any as Observable<WsStockSearchResult>;
  }

  searchStockItems$(seachFilter: WsItemVariantStockSearch, pagination: Pagination): Observable<SearchResult<WsItemVariantStockRef>> {
    return this.apiService.api.searchItemVariantStocks({
      offset: pagination.first,
      length: pagination.rows,
      wsItemVariantStockSearch: seachFilter
    }) as any as Observable<SearchResult<WsItemVariantStockRef>>;
  }

  private doGet$(ref: WsStockRef) {
    return this.apiService.api.getStock({
      id: ref.id
    }) as any as Observable<WsStock>;
  }


  private doPut$(val: WsStock) {
    return this.apiService.api.updateStock({
      id: val.id,
      wsStock: val
    }) as any as Observable<WsStockRef>;
  }

  private doCreate$(val: WsStock) {
    return this.apiService.api.createStock({
      wsStock: val
    }) as any as Observable<WsStockRef>;
  }

  // private doDelete$(ref: WsStockRef) {
  //   return this.apiService.api.remo({
  //     id: ref.id
  //   }) as any as Observable<WsStockRef>;
  // }


  private doGetVariant$(ref: WsStockRef) {
    return this.apiService.api.getItemVariantStock({
      id: ref.id
    }) as any as Observable<WsStock>;
  }


  // private doPutVariant$(val: WsStock) {
  //   return this.apiService.api.updateS({
  //     id: val.id,
  //     wsStock: val
  //   }) as any as Observable<WsStockRef>;
  // }

  private doCreateVariant$(val: WsItemVariantStock) {
    return this.apiService.api.createItemVariantStock({
      wsItemVariantStock: val
    }) as any as Observable<WsStockRef>;
  }

  // private doDeleteVariant$(ref: WsStockRef) {
  //   return this.apiService.api.itemVariantStock({
  //     id: ref.id
  //   }) as any as Observable<WsStockRef>;
  // }
//
}
