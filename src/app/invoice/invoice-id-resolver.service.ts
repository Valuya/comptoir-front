import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsCompanyRef, WsInvoice} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {InvoiceService} from '../domain/commercial/invoice.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceIdResolverService implements Resolve<WsInvoice> {

  constructor(private invoiceService: InvoiceService,
              private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsInvoice> | Promise<WsInvoice> | WsInvoice {
    const param = route.params.invoiceId;
    if (param == null) {
      return this.createNew$();
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return this.resolveNoNumericParam$(param);
    }
    return this.invoiceService.getInvoice$({id: idParam});
  }


  private resolveNoNumericParam$(param: string) {
    return this.createNew$();
  }

  private createNew$() {
    return this.authService.getLoggedEmployeeCompanyRef$().pipe(
      filter(ref => ref != null),
      take(1),
      map(companyRef => this.createNew(companyRef))
    );
  }


  private createNew(companyRef: WsCompanyRef): WsInvoice {
    return {
      id: undefined,
      companyRef: companyRef as object,
      saleRef: undefined,
      note: undefined,
      number: undefined,
    };
  }

}
