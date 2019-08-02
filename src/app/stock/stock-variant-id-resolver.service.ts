import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {WsCompanyRef, WsItemVariantStock, WsStock} from '@valuya/comptoir-ws-api';
import {RouteUtils} from '../util/route-utils';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {StockService} from '../domain/commercial/stock.service';

@Injectable({
  providedIn: 'root'
})
export class StockVariantIdResolverService {

  constructor(private stockService: StockService,
              private authService: AuthService) {
  }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsItemVariantStock> | Promise<WsItemVariantStock> | WsItemVariantStock {
    const param = route.params.variantId;
    const resolvedStock: WsStock = RouteUtils.findRouteDataInAncestors(route.pathFromRoot, 'stock');

    if (param == null) {
      return this.createNew$(resolvedStock);
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(resolvedStock, param);
    }
    return this.stockService.getStockVariant$({id: idParam});
  }

  private resolveNoNumericParam$(stock: WsStock, param: string) {
    return this.createNew$(stock);
  }

  private createNew$(stock: WsStock) {
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      filter(ref => ref != null),
      take(1),
      map(companyRef => this.createNew(stock, companyRef))
    );
  }


  private createNew(stock: WsStock, companyRef: WsCompanyRef): WsItemVariantStock {
    return {
      id: undefined,
      stockRef: {id: stock.id},
      itemVariantRef: undefined,
      quantity: 0,
      comment: '',
    };
  }
}
