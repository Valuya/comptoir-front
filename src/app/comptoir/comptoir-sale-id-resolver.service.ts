import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {concat, Observable, of} from 'rxjs';
import {WsEmployee, WsSale} from '@valuya/comptoir-ws-api';
import {AuthService} from '../auth.service';
import {ComptoirSaleService} from './comptoir-sale.service';
import {defaultIfEmpty, delay, filter, map, switchMap, take, tap} from 'rxjs/operators';
import {SaleService} from '../domain/commercial/sale.service';

@Injectable({
  providedIn: 'root'
})
export class ComptoirSaleIdResolverService {

  constructor(private saleService: SaleService,
              private comptoirSaleService: ComptoirSaleService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsSale> | Promise<WsSale> | WsSale {
    const param = route.params.comptoirSaleId;
    let resovledSale$: Observable<WsSale>;
    if (param == null) {
      resovledSale$ = this.getActive$();
    } else {
      const idParam = parseInt(param, 10);
      if (isNaN(idParam)) {
        resovledSale$ = this.handleNonNumericParam$(param);
      } else {
        resovledSale$ = this.saleService.getSale$({id: idParam});
      }
    }
    return resovledSale$.pipe(
      delay(0),
      tap(sale => this.comptoirSaleService.initSale(sale))
    );
  }


  private handleNonNumericParam$(idParam: string) {
    if (idParam === 'active') {
      return this.getActive$();
    } else if (idParam === 'new') {
      return this.createNew$();
    } else {
      return this.createNew$();
    }
  }

  private getActive$() {
    const curActive = this.comptoirSaleService.getActiveSaleOptional();
    if (curActive == null) {
      const open$ = this.comptoirSaleService.listOpenSales$().pipe(
        filter(r => r.totalCount > 0),
        map(r => r.list[0]),
        switchMap(ref => this.saleService.getSale$(ref)),
      );
      const new$ = this.createNew$();
      return concat(open$, new$).pipe(take(1));
    } else {
      return of(curActive);
    }
  }

  private createNew$() {
    return this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
      map(employee => this.createNew(employee))
    );
  }


  private createNew(employee: WsEmployee): WsSale {
    return {
      id: null,
      companyRef: employee.companyRef,
      customerRef: undefined,
      dateTime: new Date(),
    };
  }

}
