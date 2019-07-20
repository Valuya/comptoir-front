import {Injectable} from '@angular/core';
import {ApiService} from '../api.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {WsItemVariant} from '@valuya/comptoir-ws-api';

@Injectable({
  providedIn: 'root'
})
export class ItemVariantIdResolverService {

  constructor(private apiService: ApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsItemVariant> | Promise<WsItemVariant> | WsItemVariant {
    const param = route.params.itemVariantId;
    if (param == null) {
      return of(this.createNew());
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return of(this.createNew());
    }
    return this.fetchItemVariant$(idParam);
  }

  private createNew(): WsItemVariant {
    return {} as WsItemVariant;
  }

  private fetchItemVariant$(idValue: number) {
    return this.apiService.api.getItemVariant({
      id: idValue,
    }) as any as Observable<WsItemVariant>;
  }
}
