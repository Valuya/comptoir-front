import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {Observable} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {WsEmployee, WsEmployeeRef, WsEmployeeSearch, WsEmployeeSearchResult} from '@valuya/comptoir-ws-api';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private employeeCache: CachedResourceClient<WsEmployeeRef, WsEmployee>;

  constructor(
    private apiService: ApiService
  ) {
    this.employeeCache = new CachedResourceClient<WsEmployeeRef, WsEmployee>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
    );
  }

  createEmployee$(employee: WsEmployee): Observable<WsEmployeeRef> {
    return this.employeeCache.createResource$(employee);
  }

  updateEmployee$(employee: WsEmployee): Observable<WsEmployeeRef> {
    return this.employeeCache.updateResource$(employee);
  }

  getEmployee$(ref: WsEmployeeRef): Observable<WsEmployee> {
    return this.employeeCache.getResource$(ref);
  }

  searchEmployeeList$(seachFilter: WsEmployeeSearch, pagination: Pagination): Observable<WsEmployeeSearchResult> {
    return this.apiService.api.searchEmployees({
      offset: pagination.first,
      length: pagination.rows,
      wsEmployeeSearch: seachFilter
    }) as any as Observable<WsEmployeeSearchResult>;
  }

  private doGet$(ref: WsEmployeeRef) {
    return this.apiService.api.getEmployee({
      id: ref.id
    }) as any as Observable<WsEmployee>;
  }

  private doPut$(val: WsEmployee) {
    return this.apiService.api.updateEmployee({
      id: val.id,
      wsEmployee: val
    }) as any as Observable<WsEmployeeRef>;
  }

  private doCreate$(val: WsEmployee) {
    return this.apiService.api.createEmployee({
      wsEmployee: val
    }) as any as Observable<WsEmployeeRef>;
  }

  // private doDelete$(ref: WsEmployeeRef) {
  //   return this.apiService.api.re({
  //     id: ref.id
  //   }) as any as Observable<WsEmployeeRef>;
  // }
}
