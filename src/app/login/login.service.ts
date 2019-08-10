import {Injectable} from '@angular/core';
import {HeaderUtils} from '../util/header-utils';
import {ApiService} from '../api.service';
import {Observable} from 'rxjs';
import {WsAuth, WsCompanyRef} from '@valuya/comptoir-ws-api';
import {RegistrationModel} from './register-route/registration-model';

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

  refreshToken$(refreshTokenValue: string): Observable<WsAuth> {
    return this.apiService.api.refreshAuth({
      refreshToken: refreshTokenValue
    });
  }

  testAuth(auth: WsAuth): Observable<WsAuth> {
    const authHeader = HeaderUtils.toBearerAuthHeader(auth.token);
    return this.apiService.api.login({authorization: authHeader}) as any as Observable<WsAuth>;
  }

  register(registrationModel: RegistrationModel): Observable<WsCompanyRef> {
    return this.apiService.api.registerCompany({
      wsRegistration: registrationModel
    }) as any as Observable<WsCompanyRef>;
  }

}
