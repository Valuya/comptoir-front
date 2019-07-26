import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {Observable} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {WsStock, WsStockRef, WsStockSearch, WsStockSearchResult} from '@valuya/comptoir-ws-api';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StockService {


  private stockCache: CachedResourceClient<WsStockRef, WsStock>;

  constructor(
    private apiService: ApiService
  ) {
    this.stockCache = new CachedResourceClient<WsStockRef, WsStock>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
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

  getStock$(ref: WsStockRef): Observable<WsStock> {
    return this.stockCache.getResource$(ref);
  }

  searchStockList$(seachFilter: WsStockSearch, pagination: Pagination): Observable<WsStockSearchResult> {
    return this.apiService.api.searchStocks({
      offset: pagination.first,
      length: pagination.rows,
      wsStockSearch: seachFilter
    }) as any as Observable<WsStockSearchResult>;
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
//
}
