import {Injectable} from '@angular/core';
import {HeaderUtils} from '../util/header-utils';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';
import {WsAuth} from '@valuya/comptoir-ws-api';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private apiService: ApiService) {
  }

  login(login: string, password: string): Observable<WsAuth> {
    const authHeader = HeaderUtils.tobasicAuthHeader(login, password);

    return this.apiService.api.login({authorization: authHeader}) as any as Observable<WsAuth>;
  }

  testAuth(auth: WsAuth): Observable<WsAuth> {
    const authHeader = HeaderUtils.toBearerAuthHeader(auth.token);
    return this.apiService.api.login({authorization: authHeader}) as any as Observable<WsAuth>;
  }


}
