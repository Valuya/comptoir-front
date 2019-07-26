import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {Observable} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {WsCustomer, WsCustomerRef, WsCustomerSearch, WsCustomerSearchResult} from '@valuya/comptoir-ws-api';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  private customerCache: CachedResourceClient<WsCustomerRef, WsCustomer>;

  constructor(
    private apiService: ApiService
  ) {
    this.customerCache = new CachedResourceClient<WsCustomerRef, WsCustomer>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
    );
  }

  saveCustomer(customer: WsCustomer): Observable<WsCustomer> {
    if (customer.id == null) {
      return this.customerCache.createResource$(customer).pipe(
        switchMap(ref => this.customerCache.getResource$(ref))
      );
    } else {
      return this.customerCache.updateResource$(customer).pipe(
        switchMap(ref => this.customerCache.getResource$(ref))
      );
    }
  }

  getCustomer$(ref: WsCustomerRef): Observable<WsCustomer> {
    return this.customerCache.getResource$(ref);
  }

  searchCustomerList$(seachFilter: WsCustomerSearch, pagination: Pagination): Observable<WsCustomerSearchResult> {
    return this.apiService.api.searchCustomers({
      offset: pagination.first,
      length: pagination.rows,
      wsCustomerSearch: seachFilter
    }) as any as Observable<WsCustomerSearchResult>;
  }

  private doGet$(ref: WsCustomerRef) {
    return this.apiService.api.getCustomer({
      id: ref.id
    }) as any as Observable<WsCustomer>;
  }


  private doPut$(val: WsCustomer) {
    return this.apiService.api.updateCustomer({
      id: val.id,
      wsCustomer: val
    }) as any as Observable<WsCustomerRef>;
  }

  private doCreate$(val: WsCustomer) {
    return this.apiService.api.createCustomer({
      wsCustomer: val
    }) as any as Observable<WsCustomerRef>;
  }

  // private doDelete$(ref: WsCustomerRef) {
  //   return this.apiService.api.remo({
  //     id: ref.id
  //   }) as any as Observable<WsCustomerRef>;
  // }
//
}
