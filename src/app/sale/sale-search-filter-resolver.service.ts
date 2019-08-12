import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsCompanyRef, WsSaleSearch} from '@valuya/comptoir-ws-api';
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
      map(companyRef => this.setFilterCompanyRef(wsSaleSearch, companyRef))
    );
  }

  private setFilterCompanyRef(searchFilter: WsSaleSearch, companyRefValue: WsCompanyRef) {
    return Object.assign({}, searchFilter, {
      companyRef: companyRefValue
    }) as WsSaleSearch;
  }
}
