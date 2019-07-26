import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {Observable} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {WsInvoice, WsInvoiceRef, WsInvoiceSearch, WsInvoiceSearchResult} from '@valuya/comptoir-ws-api';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {


  private invoiceCache: CachedResourceClient<WsInvoiceRef, WsInvoice>;

  constructor(
    private apiService: ApiService
  ) {
    this.invoiceCache = new CachedResourceClient<WsInvoiceRef, WsInvoice>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
    );
  }

  saveInvoice(invoice: WsInvoice): Observable<WsInvoice> {
    if (invoice.id == null) {
      return this.invoiceCache.createResource$(invoice).pipe(
        switchMap(ref => this.invoiceCache.getResource$(ref))
      );
    } else {
      return this.invoiceCache.updateResource$(invoice).pipe(
        switchMap(ref => this.invoiceCache.getResource$(ref))
      );
    }
  }

  getInvoice$(ref: WsInvoiceRef): Observable<WsInvoice> {
    return this.invoiceCache.getResource$(ref);
  }

  searchInvoiceList$(seachFilter: WsInvoiceSearch, pagination: Pagination): Observable<WsInvoiceSearchResult> {
    return this.apiService.api.searchInvoices({
      offset: pagination.first,
      length: pagination.rows,
      wsInvoiceSearch: seachFilter
    }) as any as Observable<WsInvoiceSearchResult>;
  }

  private doGet$(ref: WsInvoiceRef) {
    return this.apiService.api.getInvoice({
      id: ref.id
    }) as any as Observable<WsInvoice>;
  }


  private doPut$(val: WsInvoice) {
    return this.apiService.api.updateInvoice({
      id: val.id,
      wsInvoice: val
    }) as any as Observable<WsInvoiceRef>;
  }

  private doCreate$(val: WsInvoice) {
    return this.apiService.api.createInvoice({
      wsInvoice: val
    }) as any as Observable<WsInvoiceRef>;
  }

  // private doDelete$(ref: WsInvoiceRef) {
  //   return this.apiService.api.remo({
  //     id: ref.id
  //   }) as any as Observable<WsInvoiceRef>;
  // }
//
}
