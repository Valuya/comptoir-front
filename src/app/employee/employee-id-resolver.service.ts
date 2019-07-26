import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsEmployee} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {EmployeeService} from '../domain/thirdparty/employee.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeIdResolverService implements Resolve<WsEmployee> {

  constructor(private employeeService: EmployeeService,
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
    return this.employeeService.getEmployee$({id: idParam});
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
