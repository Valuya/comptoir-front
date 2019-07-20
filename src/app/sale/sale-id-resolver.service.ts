import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsSale} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ApiService} from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class SaleIdResolverService implements Resolve<WsSale> {

  constructor(private apiService: ApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsSale> | Promise<WsSale> | WsSale {
    const param = route.params.saleId;
    if (param == null) {
      return of(this.createNew());
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return of(this.createNew());
    }
    return this.fetchSale$(idParam);
  }

  private createNew(): WsSale {
    return {} as WsSale;
  }

  private fetchSale$(idValue: number) {
    return this.apiService.api.getSale({
      id: idValue,
    }) as any as Observable<WsSale>;
  }
}
