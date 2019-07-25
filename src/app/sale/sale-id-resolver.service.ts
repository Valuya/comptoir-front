import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsSale, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {SaleService} from '../domain/commercial/sale.service';

@Injectable({
  providedIn: 'root'
})
export class SaleIdResolverService implements Resolve<WsSale> {

  constructor(private saleService: SaleService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsSale> | Promise<WsSale> | WsSale {
    const param = route.params.saleId;
    if (param == null) {
      return this.createNew$();
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(param);
    }
    return this.saleService.getSale$({id: idParam});
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


  private createNew(companyRef: WsCompanyRef): WsSale {
    return {
      id: undefined,
      dateTime: new Date(),
      companyRef: companyRef as object,
      customerRef: undefined,
      closed: false,
    };
  }

}
