import {Injectable} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {concat, EMPTY, Observable, of} from 'rxjs';
import {WsEmployee, WsSale} from '@valuya/comptoir-ws-api';
import {AuthService} from '../auth.service';
import {ComptoirSaleService} from './comptoir-sale.service';
import {delay, filter, map, take, tap} from 'rxjs/operators';
import {SaleService} from '../domain/commercial/sale.service';

@Injectable({
  providedIn: 'root'
})
export class ComptoirSaleIdResolverService implements Resolve<WsSale> {

  constructor(private saleService: SaleService,
              private router: Router,
              private comptoirSaleService: ComptoirSaleService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsSale> | Promise<WsSale> | WsSale {
    const param = route.params.comptoirSaleId;
    let resovledSale$: Observable<WsSale>;
    if (param == null) {
      this.navigateToActive(route);
      return EMPTY;
    } else {
      const idParam = parseInt(param, 10);
      if (isNaN(idParam)) {
        resovledSale$ = this.handleNonNumericParam$(route, param);
      } else {
        resovledSale$ = this.saleService.getSale$({id: idParam});
      }
    }
    return resovledSale$.pipe(
      delay(0),
      tap(sale => this.comptoirSaleService.initSale(sale))
    );
  }


  private handleNonNumericParam$(route: ActivatedRouteSnapshot, idParam: string) {
    if (idParam === 'active') {
      this.navigateToActive(route);
      return EMPTY;
    } else if (idParam === 'new') {
      return this.createNew$();
    } else {
      this.router.navigate(['/comptoir/sale/new']);
      return EMPTY;
    }
  }

  private navigateToActive(route: ActivatedRouteSnapshot) {
    this.getActive$(route)
      .subscribe(sale => this.router.navigate(['/comptoir/sale', (sale.id == null ? 'new' : sale.id)]));
  }

  private getActive$(route: ActivatedRouteSnapshot) {
    const curActive = this.comptoirSaleService.getActiveSaleOptional();
    if (curActive == null) {
      const open$ = this.comptoirSaleService.getOpenSales$().pipe(
        take(1),
        filter(r => r.totalCount > 0),
        map(r => r.list[0]),
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
