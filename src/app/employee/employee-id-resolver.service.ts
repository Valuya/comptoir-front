import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsEmployee} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ApiService} from '../api.service';
import {AuthService} from '../auth.service';
import {filter, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeIdResolverService implements Resolve<WsEmployee> {

  constructor(private apiService: ApiService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsEmployee> | Promise<WsEmployee> | WsEmployee {
    const param = route.params.employeeId;
    if (param == null) {
      return of(this.createNew());
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.handleNonNumericParam(param);
    }
    return this.fetchEmployee$(idParam);
  }


  private fetchEmployee$(idValue: number) {
    return this.apiService.api.getEmployee({
      id: idValue,
    }) as any as Observable<WsEmployee>;
  }

  private handleNonNumericParam(idParam: string) {
    if (idParam === 'me') {
      return this.authService.getLoggedEmployee$().pipe(
        filter(e => e != null),
        take(1),
      );
    } else {
      return of(this.createNew());
    }
  }

  private createNew(): WsEmployee {
    return {} as WsEmployee;
  }
}
