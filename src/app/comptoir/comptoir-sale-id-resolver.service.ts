import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {WsEmployee, WsSale} from '@valuya/comptoir-ws-api';
import {ApiService} from '../api.service';
import {AuthService} from '../auth.service';
import {ComptoirSaleService} from './comptoir-sale.service';
import {delay, filter, map, switchMap, take, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ComptoirSaleIdResolverService {

  constructor(private apiService: ApiService,
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
        resovledSale$ = this.fetchSale$(idParam);
      }
    }
    return resovledSale$.pipe(
      delay(0),
      tap(sale => this.comptoirSaleService.initSale(sale))
    );
  }


  private fetchSale$(idValue: number) {
    return this.apiService.api.getSale({
      id: idValue,
    }) as any as Observable<WsSale>;
  }

  private handleNonNumericParam$(idParam: string) {
    if (idParam === 'active') {
      return this.getActive$();
    } else {
      return this.createNew$();
    }
  }

  private getActive$() {
    return this.comptoirSaleService.getSale$().pipe(
      take(1),
      switchMap(sale => sale == null ? this.createNew$() : of(sale))
    );
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
