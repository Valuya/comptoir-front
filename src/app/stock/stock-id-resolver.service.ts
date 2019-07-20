import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsStock} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ApiService} from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class StockIdResolverService implements Resolve<WsStock> {

  constructor(private apiService: ApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsStock> | Promise<WsStock> | WsStock {
    const param = route.params.stockId;
    if (param == null) {
      return of(this.createNew());
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return of(this.createNew());
    }
    return this.fetchStock$(idParam);
  }

  private createNew(): WsStock {
    return {} as WsStock;
  }

  private fetchStock$(idValue: number) {
    return this.apiService.api.getStock({
      id: idValue,
    }) as any as Observable<WsStock>;
  }
}
