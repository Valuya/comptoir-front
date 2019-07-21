import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsEmployee, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ApiService} from '../api.service';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';

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
      return this.createNew$();
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(param);
    }
    return this.fetchEmployee$(idParam);
  }

  private fetchEmployee$(idValue: number) {
    return this.apiService.api.getEmployee({
      id: idValue,
    }) as any as Observable<WsEmployee>;
  }

  private resolveNoNumericParam$(param: string) {
    if (param === 'me') {
      return this.authService.getLoggedEmployee$().pipe(
        filter(e => e != null),
        take(1),
      );
    }
    return this.createNew$();
  }

  private createNew$() {
    return this.authService.getLoggedEmployee$().pipe(
      filter(ref => ref != null),
      take(1),
      map(companyRef => this.createNew(companyRef))
    );
  }


  private createNew(loggedEmployee: WsEmployee): WsEmployee {
    return {
      id: null,
      companyRef: loggedEmployee.companyRef,
      active: true,
      locale: loggedEmployee.locale,
      login: undefined,
    };
  }

}
