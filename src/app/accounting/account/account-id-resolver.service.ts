import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsAccount, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {AccountService} from '../../domain/accounting/account.service';

@Injectable({
  providedIn: 'root'
})
export class AccountIdResolverService implements Resolve<WsAccount> {

  constructor(private accountService: AccountService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsAccount> | Promise<WsAccount> | WsAccount {
    const param = route.params.accountId;
    if (param == null) {
      return this.createNew$();
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(param);
    }
    return this.accountService.getAccount$({id: idParam});
  }


  private resolveNoNumericParam$(param: string) {
    return this.createNew$();
  }

  private createNew$() {
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      filter(ref => ref != null),
      take(1),
      map(companyRef => this.createNew(companyRef as WsCompanyRef))
    );
  }


  private createNew(companyRef: WsCompanyRef): WsAccount {
    return {
      id: undefined,
      accountingNumber: null,
      name: null,
      bic: null,
      iban: null,
      description: [],
      cash: false,
      accountType: null,
      companyRef: companyRef as object,
    };
  }

}
