import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {LoginService} from '../login.service';
import {AuthService} from '../../auth.service';
import {WsAuth} from '@valuya/comptoir-ws-api';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {map, publishReplay, refCount, take} from 'rxjs/operators';
import {NavigationService} from '../../navigation.service';

@Component({
  selector: 'cp-login-route',
  templateUrl: './login-route.component.html',
  styleUrls: ['./login-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginRouteComponent implements OnInit {

  loginMessage$ : Observable<string>;
  loginError$ = new BehaviorSubject<string>(null);
  loading$ = new BehaviorSubject<boolean>(false);

  login: string;
  password: string;
  rememberLogin: boolean;


  constructor(private loginService: LoginService,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute,
              private navigationService: NavigationService,
  ) {
  }

  ngOnInit() {
    this.loginMessage$ = this.route.queryParams.pipe(
      map(params => params.reason as string),
      publishReplay(1), refCount()
    );
  }

  submit() {
    this.loading$.next(true);
    this.loginError$.next(null);
    this.loginService.login(this.login, this.password)
      .subscribe(auth => this.onLoginSuccess(auth),
        error => this.onLoginError(error));
  }

  private onLoginSuccess(auth: WsAuth) {
    this.loading$.next(false);
    this.authService.setAuth(auth);
    this.redirectOnLoggedIn();
  }

  private redirectOnLoggedIn() {
    this.navigationService.navigateWithRedirectCheck(['/']);
  }

  private onLoginError(error: any) {
    this.loading$.next(false);
    this.loginError$.next(error);
  }
}
