import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

export interface ResolvedRouteItem<T> {
  labelFactory?: (snapshot: RouterStateSnapshot | ActivatedRouteSnapshot) => string;
  routerLinkFactory?: (snapshot: RouterStateSnapshot | ActivatedRouteSnapshot) => any[];
}
