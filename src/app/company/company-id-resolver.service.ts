import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsCompany} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {AuthService} from '../auth.service';
import {filter, map, switchMap, take} from 'rxjs/operators';
import {CompanyService} from '../domain/commercial/company.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyIdResolverService implements Resolve<WsCompany> {

  constructor(private companyService: CompanyService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsCompany> | Promise<WsCompany> | WsCompany {
    const param = route.params.companyId;
    if (param == null) {
      return this.getMyCompany();
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(param);
    }
    return this.companyService.getCompany$({id: idParam});
  }

  private resolveNoNumericParam$(param: string) {
    if (param === 'mine') {
      return this.getMyCompany();
    } else {
      return this.getMyCompany();
    }
  }

  private getMyCompany() {
    return this.authService.getNextNonNullLoggedEmployeeCompanyRef$().pipe(
      filter(e => e != null),
      take(1),
      switchMap(ref => this.companyService.getCompany$(ref))
    );
  }
}
