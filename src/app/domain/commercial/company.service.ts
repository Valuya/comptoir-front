import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {Observable} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {WsCompany, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {


  private companyCache: CachedResourceClient<WsCompanyRef, WsCompany>;

  constructor(
    private apiService: ApiService
  ) {
    this.companyCache = new CachedResourceClient<WsCompanyRef, WsCompany>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
    );
  }

  saveCompany(company: WsCompany): Observable<WsCompanyRef> {
    if (company.id == null) {
      return this.companyCache.createResource$(company);
    } else {
      return this.companyCache.updateResource$(company);
    }
  }

  getCompany$(ref: WsCompanyRef): Observable<WsCompany> {
    return this.companyCache.getResource$(ref);
  }

  private doGet$(ref: WsCompanyRef) {
    return this.apiService.api.getCompany({
      id: ref.id
    }) as any as Observable<WsCompany>;
  }


  private doPut$(val: WsCompany) {
    return this.apiService.api.updateCompany({
      id: val.id,
      wsCompany: val
    }) as any as Observable<WsCompanyRef>;
  }

  private doCreate$(val: WsCompany) {
    return this.apiService.api.createCompany({
      wsCompany: val
    }) as any as Observable<WsCompanyRef>;
  }

  // private doDelete$(ref: WsCompanyRef) {
  //   return this.apiService.api.remo({
  //     id: ref.id
  //   }) as any as Observable<WsCompanyRef>;
  // }
//
}
