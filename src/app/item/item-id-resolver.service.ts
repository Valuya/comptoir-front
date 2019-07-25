import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsItem, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {ItemService} from '../domain/commercial/item.service';

@Injectable({
  providedIn: 'root'
})
export class ItemIdResolverService implements Resolve<WsItem> {

  constructor(private itemService: ItemService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsItem> | Promise<WsItem> | WsItem {
    const param = route.params.itemId;
    if (param == null) {
      return this.createNew$();
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(param);
    }
    return this.itemService.getItem$({id: idParam});
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


  private createNew(companyRef: WsCompanyRef): WsItem {
    return {
      id: undefined,
      companyRef: companyRef as object,
      mainPictureRef: undefined,
      reference: undefined,
      name: [],
      description: [],
      multipleSale: false,
    };
  }

}
