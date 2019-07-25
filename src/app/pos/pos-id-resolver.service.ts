import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsCompanyRef, WsPos} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {PosService} from '../domain/commercial/pos.service';

@Injectable({
  providedIn: 'root'
})
export class PosIdResolverService implements Resolve<WsPos> {

  constructor(private posService: PosService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsPos> | Promise<WsPos> | WsPos {
    const param = route.params.posId;
    if (param == null) {
      return this.createNew$();
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(param);
    }
    return this.posService.getPos$({id: idParam});
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


  private createNew(companyRef: WsCompanyRef): WsPos {
    return {
      id: null,
      companyRef: companyRef as object,
      description: [],
      name: null,
    };
  }

}
