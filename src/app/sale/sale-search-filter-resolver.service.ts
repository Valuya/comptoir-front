import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsSaleSearch} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {SaleSearchFilterUtils} from './sale-search-filter-utils';
import {AuthService} from '../auth.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SaleSearchFilterResolverService implements Resolve<WsSaleSearch> {

  constructor(
    private authService: AuthService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsSaleSearch> | Promise<WsSaleSearch> | WsSaleSearch {
    const queryParams = route.queryParams;
    const wsSaleSearch = SaleSearchFilterUtils.deserializeFilter(queryParams);
    if (wsSaleSearch.closed == null) {
      wsSaleSearch.closed = false;
    }

    return this.authService.getNextNonNullLoggedEmployeeCompanyRef$().pipe(
      map(companyref => {
        return Object.assign({}, wsSaleSearch, {
          companyRef: companyref
        }) as WsSaleSearch;
      })
    );
  }
}
