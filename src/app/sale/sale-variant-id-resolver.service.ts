import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {WsCompanyRef, WsItemVariantSale, WsSale} from '@valuya/comptoir-ws-api';
import {RouteUtils} from '../util/route-utils';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {SaleService} from '../domain/commercial/sale.service';

@Injectable({
  providedIn: 'root'
})
export class SaleVariantIdResolverService {

  constructor(private saleService: SaleService,
              private authService: AuthService) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsItemVariantSale> | Promise<WsItemVariantSale> | WsItemVariantSale {
    const param = route.params.variantId;
    const resolvedSale: WsSale = RouteUtils.findRouteDataInAncestors(route.pathFromRoot, 'sale');

    if (param == null) {
      return this.createNew$(resolvedSale);
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(resolvedSale, param);
    }
    return this.saleService.getVariant$({id: idParam});
  }

  private resolveNoNumericParam$(sale: WsSale, param: string) {
    return this.createNew$(sale);
  }

  private createNew$(sale: WsSale) {
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      filter(ref => ref != null),
      take(1),
      map(companyRef => this.createNew(sale, companyRef))
    );
  }


  private createNew(sale: WsSale, companyRef: WsCompanyRef): WsItemVariantSale {
    return {
      id: undefined,
      saleRef: {id: sale.id},
      stockRef: undefined,
      itemVariantRef: undefined,
      quantity: 0,
      dateTime: new Date(),
      comment: [],
    };
  }
}
