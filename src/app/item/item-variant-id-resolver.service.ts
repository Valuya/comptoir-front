import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {WsCompanyRef, WsItem, WsItemVariant, WsItemVariantPricingEnum} from '@valuya/comptoir-ws-api';
import {RouteUtils} from '../util/route-utils';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {ItemService} from '../domain/commercial/item.service';

@Injectable({
  providedIn: 'root'
})
export class ItemVariantIdResolverService {

  constructor(private itemService: ItemService,
              private authService: AuthService) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsItemVariant> | Promise<WsItemVariant> | WsItemVariant {
    const param = route.params.variantId;
    const resolvedItem: WsItem = RouteUtils.findRouteDataInRouteSnapshotAncestors(route.pathFromRoot, 'item');

    if (param == null) {
      return this.createNew$(resolvedItem);
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(resolvedItem, param);
    }
    return this.itemService.getItemVariant$({id: idParam});
  }

  private resolveNoNumericParam$(item: WsItem, param: string) {
    return this.createNew$(item);
  }

  private createNew$(item: WsItem) {
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      filter(ref => ref != null),
      take(1),
      map(companyRef => this.createNew(item, companyRef))
    );
  }


  private createNew(item: WsItem, companyRef: WsCompanyRef): WsItemVariant {
    return {
      id: undefined,
      itemRef: {id: item.id},
      attributeValueRefs: [],
      pricingAmount: 0,
      pricing: WsItemVariantPricingEnum.PARENTITEM,
      variantReference: undefined,
      mainPictureRef: undefined,
    };
  }
}
