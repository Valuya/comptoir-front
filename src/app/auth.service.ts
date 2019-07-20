import {Injectable} from '@angular/core';
import {WsAuth, WsCompanyRef, WsEmployee} from '@valuya/comptoir-ws-api';
import * as moment from 'moment';
import {BehaviorSubject, concat, Observable, of} from 'rxjs';
import {map, publishReplay, refCount, switchMap} from 'rxjs/operators';
import {ApiService} from './api.service';
import {AuthProvider} from './util/auth-provider';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOCAL_STORATE_AUTH_KEY = 'comptoir-ws-auth';

  private auth$ = new BehaviorSubject<WsAuth | null>(null);
  private loggedEmployee$: Observable<WsEmployee | null>;

  constructor(private apiService: ApiService,
              private authProvider: AuthProvider) {
    this.loggedEmployee$ = this.auth$.pipe(
      switchMap(auth => this.fetchLoggedEmployee$(auth)),
      publishReplay(1), refCount(),
    );
    const firstAuth = this.loadAuth();
    if (firstAuth != null) {
      this.setAuth(firstAuth);
    }
  }

  getAuth(): WsAuth | null {
    return this.auth$.getValue();
  }

  setAuth(auth: WsAuth) {
    this.authProvider.auth = auth;
    this.auth$.next(auth);
    this.saveAuth(auth);
  }

  hasAuth(): boolean {
    const auth = this.getAuth();
    return auth != null
      && this.checkExpire(auth);
  }

  getLoggedEmployee$(): Observable<WsEmployee | null> {
    return this.loggedEmployee$;
  }

  getLoggedEmployeeCompanyRef$(): Observable<WsCompanyRef | null> {
    return this.loggedEmployee$.pipe(
      map(employee => employee == null ? null : employee.companyRef as WsCompanyRef)
    );
  }

  private checkExpire(auth: WsAuth): boolean {
    const expireDate = auth.expirationDateTime;
    const now = moment();
    return now.isBefore(expireDate);
  }

  private fetchLoggedEmployee$(auth: WsAuth | null): Observable<WsEmployee> {
    const tasks$List = [of(null)];
    if (auth != null) {
      const empoyeeRef = auth.employeeRef;
      if (empoyeeRef != null) {
        const fetchTask$ = this.apiService.api.getEmployee({
          id: empoyeeRef.id
        }) as any as Observable<WsEmployee>;
        tasks$List.push(fetchTask$);
      }
    }
    return concat(...tasks$List);
  }

  private saveAuth(auth: WsAuth) {
    if (window.localStorage) {
      window.localStorage.setItem(this.LOCAL_STORATE_AUTH_KEY, JSON.stringify(auth));
    }
  }

  private loadAuth(): WsAuth | null {
    if (window.localStorage) {
      const authJson = window.localStorage.getItem(this.LOCAL_STORATE_AUTH_KEY);
      try {
        const wsAuth: WsAuth = JSON.parse(authJson);
        const valid = this.checkExpire(wsAuth);
        return valid ? wsAuth : null;
      } catch (e) {
        return null;
      }
    }
  }
}
