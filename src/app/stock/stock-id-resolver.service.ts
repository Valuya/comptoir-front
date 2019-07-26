import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsStock, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {StockService} from '../domain/commercial/stock.service';

@Injectable({
  providedIn: 'root'
})
export class StockIdResolverService implements Resolve<WsStock> {

  constructor(private stockService: StockService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsStock> | Promise<WsStock> | WsStock {
    const param = route.params.stockId;
    if (param == null) {
      return this.createNew$();
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(param);
    }
    return this.stockService.getStock$({id: idParam});
  }

  private resolveNoNumericParam$(param: string) {
    return this.createNew$();
  }

  private createNew$() {
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      filter(ref => ref != null),
      take(1),
      map(companyRef => this.createNew(companyRef))
    );
  }


  private createNew(companyRef: WsCompanyRef): WsStock {
    return {
      id: null,
      companyRef: companyRef as object,
      description: [],
      active: true
    };
  }

}
