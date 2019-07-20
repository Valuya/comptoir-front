import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {WsItem} from '@valuya/comptoir-ws-api';

@Injectable({
  providedIn: 'root'
})
export class ItemIdResolverService {


  constructor(private apiService: ApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsItem> | Promise<WsItem> | WsItem {
    const param = route.params.itemId;
    if (param == null) {
      return of(this.createNew());
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return of(this.createNew());
    }
    return this.fetchItem$(idParam);
  }

  private createNew(): WsItem {
    return {} as WsItem;
  }

  private fetchItem$(idValue: number) {
    return this.apiService.api.getItem({
      id: idValue,
    }) as any as Observable<WsItem>;
  }}
