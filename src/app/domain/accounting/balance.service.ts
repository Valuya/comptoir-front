import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {Observable} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {WsBalance, WsBalanceRef, WsBalanceSearch, WsBalanceSearchResult} from '@valuya/comptoir-ws-api';
import {mergeMap, switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {


  private balanceCache: CachedResourceClient<WsBalanceRef, WsBalance>;

  constructor(
    private apiService: ApiService
  ) {
    this.balanceCache = new CachedResourceClient<WsBalanceRef, WsBalance>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
    );
  }

  saveBalance(balance: WsBalance): Observable<WsBalanceRef> {
    if (balance.id == null) {
      return this.balanceCache.createResource$(balance);
    } else {
      return this.balanceCache.updateResource$(balance);
    }
  }

  getBalance$(ref: WsBalanceRef): Observable<WsBalance> {
    return this.balanceCache.getResource$(ref);
  }

  searchBalanceList$(seachFilter: WsBalanceSearch, pagination: Pagination): Observable<WsBalanceSearchResult> {
    return this.apiService.api.searchBalances({
      offset: pagination.first,
      length: pagination.rows,
      wsBalanceSearch: seachFilter
    }) as any as Observable<WsBalanceSearchResult>;
  }

  private doGet$(ref: WsBalanceRef) {
    return this.apiService.api.getBalance({
      id: ref.id
    }) as any as Observable<WsBalance>;
  }


  private doPut$(val: WsBalance) {
    return this.apiService.api.updateBalance({
      id: val.id,
      wsBalance: val
    }) as any as Observable<WsBalanceRef>;
  }

  private doCreate$(val: WsBalance) {
    return this.apiService.api.createBalance({
      wsBalance: val
    }) as any as Observable<WsBalanceRef>;
  }

  // private doDelete$(ref: WsBalanceRef) {
  //   return this.apiService.api.remo({
  //     id: ref.id
  //   }) as any as Observable<WsBalanceRef>;
  // }
//
}
