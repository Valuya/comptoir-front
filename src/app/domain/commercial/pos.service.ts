import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {Observable} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {WsBalance, WsBalanceRef, WsPos, WsPosRef, WsPosSearch, WsPosSearchResult} from '@valuya/comptoir-ws-api';

@Injectable({
  providedIn: 'root'
})
export class PosService {


  private posCache: CachedResourceClient<WsPosRef, WsPos>;

  constructor(
    private apiService: ApiService
  ) {
    this.posCache = new CachedResourceClient<WsPosRef, WsPos>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
    );
  }


  savePos(pos: WsPos): Observable<WsPosRef> {
    if (pos.id == null) {
      return this.posCache.createResource$(pos);
    } else {
      return this.posCache.updateResource$(pos);
    }
  }

  getPos$(ref: WsPosRef): Observable<WsPos> {
    return this.posCache.getResource$(ref);
  }

  searchPosList$(seachFilter: WsPosSearch, pagination: Pagination): Observable<WsPosSearchResult> {
    return this.apiService.api.findPosList({
      offset: pagination.first,
      length: pagination.rows,
      wsPosSearch: seachFilter
    }) as any as Observable<WsPosSearchResult>;
  }

  private doGet$(ref: WsPosRef) {
    return this.apiService.api.getPos({
      id: ref.id
    }) as any as Observable<WsPos>;
  }


  private doPut$(val: WsPos) {
    return this.apiService.api.updatePos({
      id: val.id,
      wsPos: val
    }) as any as Observable<WsPosRef>;
  }

  private doCreate$(val: WsPos) {
    return this.apiService.api.createPos({
      wsPos: val
    }) as any as Observable<WsPosRef>;
  }

  // private doDelete$(ref: WsPosRef) {
  //   return this.apiService.api.remo({
  //     id: ref.id
  //   }) as any as Observable<WsPosRef>;
  // }
//
}
