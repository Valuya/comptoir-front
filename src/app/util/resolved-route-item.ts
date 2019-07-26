import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

export interface ResolvedRouteItem<T = any> {
  labelFactory?: (snapshot: RouterStateSnapshot | ActivatedRouteSnapshot) => string;
  routerLinkFactory?: (snapshot: RouterStateSnapshot | ActivatedRouteSnapshot) => any[];
}
