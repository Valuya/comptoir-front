import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsCustomer} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ApiService} from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerIdResolverService implements Resolve<WsCustomer> {

  constructor(private apiService: ApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsCustomer> | Promise<WsCustomer> | WsCustomer {
    const param = route.params.customerId;
    if (param == null) {
      return of(this.createNew());
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return of(this.createNew());
    }
    return this.fetchCustomer$(idParam);
  }

  private createNew(): WsCustomer {
    return {} as WsCustomer;
  }

  private fetchCustomer$(idValue: number) {
    return this.apiService.api.getCustomer({
      id: idValue,
    }) as any as Observable<WsCustomer>;
  }
}
