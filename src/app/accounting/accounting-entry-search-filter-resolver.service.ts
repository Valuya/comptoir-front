import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsAccountingEntrySearch, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {AccountingEntrySearchFilterSerializer} from './accounting-entry-search-filter-serializer';
import {AuthService} from '../auth.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AccountingEntrySearchFilterResolverService implements Resolve<WsAccountingEntrySearch> {

  constructor(
    private authService: AuthService,
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsAccountingEntrySearch> | Promise<WsAccountingEntrySearch> | WsAccountingEntrySearch {
    const queryParams = route.queryParams;
    const searchFilter = AccountingEntrySearchFilterSerializer.deserializeFilter(queryParams);

    return this.authService.getNextNonNullLoggedEmployeeCompanyRef$().pipe(
      map(companyRef => this.setFilterCompanyRef(searchFilter, companyRef))
    );
  }

  private setFilterCompanyRef(searchFilter: WsAccountingEntrySearch, companyRefValue: WsCompanyRef) {
    searchFilter.accountSearch = Object.assign({}, searchFilter.accountSearch, {
      companyRef: companyRefValue
    });
    searchFilter.companyRef = companyRefValue;
    return searchFilter;
  }
}
