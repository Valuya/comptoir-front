import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {WsEmployee} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {filter, take} from 'rxjs/operators';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedEmployeeResolverService implements Resolve<WsEmployee> {

  constructor(private authService: AuthService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<WsEmployee> | Promise<WsEmployee> | WsEmployee {
    return this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
    );
  }
}
