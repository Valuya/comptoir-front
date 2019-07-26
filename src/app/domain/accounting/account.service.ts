import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {Observable} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {WsAccount, WsAccountRef, WsAccountSearch, WsAccountSearchResult} from '@valuya/comptoir-ws-api';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountService {


  private accountCache: CachedResourceClient<WsAccountRef, WsAccount>;

  constructor(
    private apiService: ApiService
  ) {
    this.accountCache = new CachedResourceClient<WsAccountRef, WsAccount>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
    );
  }

  saveAccount(account: WsAccount): Observable<WsAccount> {
    if (account.id == null) {
      return this.accountCache.createResource$(account).pipe(
        switchMap(ref => this.accountCache.getResource$(ref))
      );
    } else {
      return this.accountCache.updateResource$(account).pipe(
        switchMap(ref => this.accountCache.getResource$(ref))
      );
    }
  }

  getAccount$(ref: WsAccountRef): Observable<WsAccount> {
    return this.accountCache.getResource$(ref);
  }

  searchAccountList$(seachFilter: WsAccountSearch, pagination: Pagination): Observable<WsAccountSearchResult> {
    return this.apiService.api.searchAccounts({
      offset: pagination.first,
      length: pagination.rows,
      wsAccountSearch: seachFilter
    }) as any as Observable<WsAccountSearchResult>;
  }

  private doGet$(ref: WsAccountRef) {
    return this.apiService.api.getAccount({
      id: ref.id
    }) as any as Observable<WsAccount>;
  }


  private doPut$(val: WsAccount) {
    return this.apiService.api.updateAccount({
      id: val.id,
      wsAccount: val
    }) as any as Observable<WsAccountRef>;
  }

  private doCreate$(val: WsAccount) {
    return this.apiService.api.createAccount({
      wsAccount: val
    }) as any as Observable<WsAccountRef>;
  }

  // private doDelete$(ref: WsAccountRef) {
  //   return this.apiService.api.remo({
  //     id: ref.id
  //   }) as any as Observable<WsAccountRef>;
  // }
//
}
