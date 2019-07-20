import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsPos} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ApiService} from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class PosIdResolverService implements Resolve<WsPos> {

  constructor(private apiService: ApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsPos> | Promise<WsPos> | WsPos {
    const param = route.params.posId;
    if (param == null) {
      return of(this.createNew());
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return of(this.createNew());
    }
    return this.fetchPos$(idParam);
  }

  private createNew(): WsPos {
    return {} as WsPos;
  }

  private fetchPos$(idValue: number) {
    return this.apiService.api.getPos({
      id: idValue,
    }) as any as Observable<WsPos>;
  }
}
