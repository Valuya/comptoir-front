import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsEmployee} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ApiService} from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeIdResolverService implements Resolve<WsEmployee> {

  constructor(private apiService: ApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsEmployee> | Promise<WsEmployee> | WsEmployee {
    const param = route.params.employeeId;
    if (param == null) {
      return of(this.createNew());
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return of(this.createNew());
    }
    return this.fetchEmployee$(idParam);
  }

  private createNew(): WsEmployee {
    return {} as WsEmployee;
  }

  private fetchEmployee$(idValue: number) {
    return this.apiService.api.getEmployee({
      id: idValue,
    }) as any as Observable<WsEmployee>;
  }
}
