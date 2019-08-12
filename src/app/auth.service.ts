import {Injectable} from '@angular/core';
import {WsAuth, WsCompanyRef, WsEmployee} from '@valuya/comptoir-ws-api';
import * as moment from 'moment';
import {BehaviorSubject, concat, Observable, of, Subscription, timer} from 'rxjs';
import {filter, map, publishReplay, refCount, retry, switchMap, take} from 'rxjs/operators';
import {ApiService} from './api.service';
import {AuthProvider} from './util/auth-provider';
import {LoginService} from './login/login.service';
import {NavigationService} from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private LOCAL_STORATE_AUTH_KEY = 'comptoir-ws-auth';

  private auth$ = new BehaviorSubject<WsAuth | null>(null);
  private loggedEmployee$: Observable<WsEmployee | null>;

  private authRefreshSubscripion: Subscription;

  constructor(private apiService: ApiService,
              private loginService: LoginService,
              private navigationService: NavigationService,
              private authProvider: AuthProvider) {
    this.loggedEmployee$ = this.auth$.pipe(
      switchMap(auth => this.fetchLoggedEmployee$(auth)),
      publishReplay(1), refCount(),
    );
    const firstAuth = this.loadAuth();
    if (firstAuth != null) {
      this.loginService.testAuth(firstAuth)
        .subscribe(auth => {
          this.setAuth(auth);
          this.navigationService.navigateWithRedirectCheck(['/']);
        });
    }
  }

  getAuth(): WsAuth | null {
    return this.auth$.getValue();
  }

  setAuth(auth: WsAuth) {
    this.unsubscribeAuthExpiration();
    this.authProvider.auth = auth;
    this.auth$.next(auth);
    this.saveAuth(auth);
    this.watchAuthExpiration(auth);
  }

  clearAuth() {
    this.unsubscribeAuthExpiration();
    this.authProvider.auth = null;
    this.auth$.next(null);
    this.saveAuth(null);
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

  getNextNonNullLoggedEmployeeCompanyRef$(): Observable<WsCompanyRef> {
    return this.loggedEmployee$.pipe(
      map(employee => employee == null ? null : employee.companyRef as WsCompanyRef),
      filter(ref => ref != null),
      take(1),
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

  private saveAuth(auth: WsAuth | null) {
    if (window.localStorage) {
      if (auth != null) {
        window.localStorage.setItem(this.LOCAL_STORATE_AUTH_KEY, JSON.stringify(auth));
      } else {
        window.localStorage.removeItem(this.LOCAL_STORATE_AUTH_KEY);
      }
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

  private watchAuthExpiration(auth: WsAuth) {
    const expiratoin = auth.expirationDateTime;
    const expirationMoment = moment(expiratoin);
    const aBitBeforeExpiration = expirationMoment.add(-3, 'minute');

    this.unsubscribeAuthExpiration();
    this.authRefreshSubscripion = timer(aBitBeforeExpiration.toDate()).pipe(
      switchMap(() => this.loginService.refreshToken$(auth.refreshToken)),
      retry(3)
    ).subscribe(newAuth => this.setAuth(newAuth));
  }

  private unsubscribeAuthExpiration() {
    if (this.authRefreshSubscripion) {
      this.authRefreshSubscripion.unsubscribe();
    }
  }
}
