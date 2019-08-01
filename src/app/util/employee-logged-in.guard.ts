import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '../auth.service';
import {filter, map, take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EmployeeLoggedInGuard implements CanActivateChild {
  constructor(private router: Router,
              private authService: AuthService) {

  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const loggedIn = this.authService.hasAuth();
    if (!loggedIn) {
      this.router.navigate(['/login'], {
        queryParams: {
          reason: `Access denied to ${childRoute.outlet}`,
          redirectUrl: state.url
        }
      });
    }
    return loggedIn;
  }


}
