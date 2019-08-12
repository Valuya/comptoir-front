import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsBalance, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {BalanceService} from '../../domain/accounting/balance.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceIdResolverService implements Resolve<WsBalance> {

  constructor(private balanceService: BalanceService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsBalance> | Promise<WsBalance> | WsBalance {
    const param = route.params.balanceId;
    if (param == null) {
      return this.createNew$();
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(param);
    }
    return this.balanceService.getBalance$({id: idParam});
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


  private createNew(companyRef: WsCompanyRef): WsBalance {
    return {
      id: undefined,
      accountRef: undefined,
      dateTime: new Date(),
      balance: 0,
      comment: undefined,
      closed: false
    };
  }

}
