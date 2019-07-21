import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsCustomer, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ApiService} from '../api.service';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerIdResolverService implements Resolve<WsCustomer> {

  constructor(private apiService: ApiService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsCustomer> | Promise<WsCustomer> | WsCustomer {
    const param = route.params.customerId;
    if (param == null) {
      return this.createNew$();
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(param);
    }
    return this.fetchCustomer$(idParam);
  }

  private fetchCustomer$(idValue: number) {
    return this.apiService.api.getCustomer({
      id: idValue,
    }) as any as Observable<WsCustomer>;
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


  private createNew(companyRef: WsCompanyRef): WsCustomer {
    return {
      id: undefined,
      companyRef: companyRef as object,
    };
  }

}
