import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {WsSale, WsItemVariantSale} from '@valuya/comptoir-ws-api';
import {RouteUtils} from '../util/route-utils';

@Injectable({
  providedIn: 'root'
})
export class SaleVariantIdResolverService {

  constructor(private apiService: ApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsItemVariantSale> | Promise<WsItemVariantSale> | WsItemVariantSale {
    const param = route.params.variantId;
    const resolvedSale: WsSale = RouteUtils.findRouteDataInAncestors(route.pathFromRoot, 'sale');
    if (resolvedSale == null || param == null) {
      return of(this.createNew(resolvedSale));
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return of(this.createNew(resolvedSale));
    }
    return this.fetchSaleVariant$(idParam);
  }

  private createNew(resolvedSale: WsSale): WsItemVariantSale {
    return {
      saleRef: resolvedSale == null ? null : {id: resolvedSale.id},
    } as WsItemVariantSale;
  }

  private fetchSaleVariant$(idValue: number) {
    return this.apiService.api.getItemVariantSale({
      id: idValue,
    }) as any as Observable<WsItemVariantSale>;
  }
}
