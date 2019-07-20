import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsBalance} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ApiService} from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class BalanceIdResolverService implements Resolve<WsBalance> {

  constructor(private apiService: ApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsBalance> | Promise<WsBalance> | WsBalance {
    const param = route.params.balanceId;
    if (param == null) {
      return of(this.createNew());
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return of(this.createNew());
    }
    return this.fetchBalance$(idParam);
  }

  private createNew(): WsBalance {
    return {} as WsBalance;
  }

  private fetchBalance$(idValue: number) {
    return this.apiService.api.getBalance({
      id: idValue,
    }) as any as Observable<WsBalance>;
  }
}
