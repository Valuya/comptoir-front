import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';
import {NavigationService} from '../navigation.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeLoggedInGuard implements CanActivateChild {
  constructor(private router: Router,
              private navigationService: NavigationService,
              private authService: AuthService) {

  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const loggedIn = this.authService.hasAuth();
    if (!loggedIn) {
      // TODO: i18n
      this.navigationService.navigateToLoginWithReason(`You need to authenticate to access this route`, state.url);
    }
    return loggedIn;
  }


}
