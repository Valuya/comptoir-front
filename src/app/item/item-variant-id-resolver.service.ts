import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {WsItem, WsItemVariant} from '@valuya/comptoir-ws-api';
import {RouteUtils} from '../util/route-utils';

@Injectable({
  providedIn: 'root'
})
export class ItemVariantIdResolverService {

  constructor(private apiService: ApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsItemVariant> | Promise<WsItemVariant> | WsItemVariant {
    const param = route.params.variantId;
    const resolvedItem: WsItem = RouteUtils.findRouteDataInAncestors(route.pathFromRoot, 'item');
    if (resolvedItem == null || param == null) {
      return of(this.createNew(resolvedItem));
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return of(this.createNew(resolvedItem));
    }
    return this.fetchItemVariant$(idParam);
  }

  private createNew(resolvedItem: WsItem): WsItemVariant {
    return {
      itemRef: resolvedItem == null ? null : {id: resolvedItem.id},
    } as WsItemVariant;
  }

  private fetchItemVariant$(idValue: number) {
    return this.apiService.api.getItemVariant({
      id: idValue,
    }) as any as Observable<WsItemVariant>;
  }
}
