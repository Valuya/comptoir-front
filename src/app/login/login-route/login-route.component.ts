import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {LoginService} from '../login.service';
import {AuthService} from '../../auth.service';
import {WsAuth} from '@valuya/comptoir-ws-api';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {map, publishReplay, refCount, take} from 'rxjs/operators';

@Component({
  selector: 'cp-login-route',
  templateUrl: './login-route.component.html',
  styleUrls: ['./login-route.component.scss']
})
export class LoginRouteComponent implements OnInit {

  loginMessage$ = new BehaviorSubject<string>(null);
  loginError$ = new BehaviorSubject<string>(null);
  loading$ = new BehaviorSubject<boolean>(false);

  login: string;
  password: string;
  rememberLogin: boolean;

  private redirectParam$: Observable<string | null>;

  constructor(private loginService: LoginService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.redirectParam$ = this.activatedRoute.queryParams.pipe(
      map((params: Params) => params['redirect']),
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
    this.redirectParam$.pipe(
      take(1),
    ).subscribe(redirect => {
      if (redirect != null) {
        this.router.navigate([redirect]);
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  private onLoginError(error: any) {
    this.loading$.next(false);
    this.loginError$.next(error);
  }
}
