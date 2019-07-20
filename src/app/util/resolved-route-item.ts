import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

export interface ResolvedRouteItem<T> {
  labelFactory?: (value: T) => string;
  routerLinkFactory?: (snapshot: RouterStateSnapshot | ActivatedRouteSnapshot) => any[];
}
