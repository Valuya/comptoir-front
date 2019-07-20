import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsInvoice} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ApiService} from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceIdResolverService implements Resolve<WsInvoice> {

  constructor(private apiService: ApiService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsInvoice> | Promise<WsInvoice> | WsInvoice {
    const param = route.params.invoiceId;
    if (param == null) {
      return of(this.createNew());
    }
    const idParam = parseInt(param, 10);
    if (isNaN(idParam)) {
      return of(this.createNew());
    }
    return this.fetchInvoice$(idParam);
  }

  private createNew(): WsInvoice {
    return {} as WsInvoice;
  }

  private fetchInvoice$(idValue: number) {
    return this.apiService.api.getInvoice({
      id: idValue,
    }) as any as Observable<WsInvoice>;
  }
}
