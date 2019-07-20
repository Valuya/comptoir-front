import {Injectable} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {combineLatest, concat, EMPTY, Observable, of} from 'rxjs';
import {ActivatedRoute, Route, Router} from '@angular/router';
import {distinctUntilChanged, map, mergeMap, publishReplay, refCount, switchMap, tap, toArray} from 'rxjs/operators';
import {APP_MODULES_ROUTES, APP_SHELL_ROUTE_DATA_ID, AppRouteData} from '../app-routes';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppMenuService {

  appMenu$: Observable<MenuItem[]>;

  constructor(private router: Router,
              private authService: AuthService) {
    this.appMenu$ = this.authService.getLoggedEmployee$().pipe(
      distinctUntilChanged(),
      switchMap(employee => this.createAppMenu$(employee)),
      publishReplay(1), refCount()
    );
  }

  createAppMenu$(loggeduser?: any): Observable<MenuItem[]> {
    const appRoutes$List = APP_MODULES_ROUTES.map(
      appRoute => this.filterDisabledRoute$(appRoute, loggeduser),
    );
    return concat(...appRoutes$List).pipe(
      toArray(),
      tap(routes => this.resetRouterConfig(routes)),
      map(routes => this.createRoutesMenu(routes))
    );
  }

  createBreadcrumbMenuFromRoute$(activatedRoute: ActivatedRoute): Observable<MenuItem[]> {
    const routePath = activatedRoute.pathFromRoot;
    const menuItem$List = routePath.map(
      part => this.createActivatedRouteMenuItem(part)
    );
    const menuitem$ = menuItem$List.length === 0 ? of([]) : combineLatest(menuItem$List);
    return menuitem$.pipe(
      map(list => list.filter(item => item != null))
    );
  }

  private createActivatedRouteMenuItem(routePart: ActivatedRoute): Observable<MenuItem | null> {
    return routePart.data.pipe(
      map(routeData => this.createRouteMenuItemFromData(routeData))
    );
  }

  private createRouteMenuItemFromData(routeData: AppRouteData) {
    if (routeData == null) {
      return null;
    }
    if (routeData.menuItem != null) {
      const menuData: MenuItem = routeData.menuItem;
      const cloneItem: MenuItem = Object.assign({}, menuData);
      return cloneItem;
    }
    return null;
  }

  private createLoggedUserMenuItem(): MenuItem {
    return {
      icon: 'fa fa-user',
      routerLink: ['/me']
    };
  }

  private filterDisabledRoute$(appRoute: Route, loggeduser: any): Observable<Route> {
    const data = appRoute.data as AppRouteData;
    if (data != null && data.menuItem != null) {
      if (data.menuItem.routerLink == null || data.menuItem.routerLink.length === 0) {
        return EMPTY;
      }
    }

    const featureEnabled$ = of(true);
    return featureEnabled$.pipe(
      mergeMap(enabled => enabled ? of(appRoute) : EMPTY)
    );
  }

  private resetRouterConfig(routes: Route[]) {
    const baseConfig = this.cloneBaseRouterConfig();
    const shellRouteConfig = this.flattenRoutes(baseConfig)
      .find(route => route.data != null && route.data.id === APP_SHELL_ROUTE_DATA_ID);
    if (shellRouteConfig == null) {
      throw new Error(`No shell route with data id ${APP_SHELL_ROUTE_DATA_ID}`);
    }
    shellRouteConfig.children = routes;
    this.router.resetConfig(baseConfig);
  }

  private flattenRoutes(routes: Route[]): Route[] {
    return routes.reduce((cur, next) => {
      const nexts = [next];
      if (next.children != null) {
        nexts.push(...this.flattenRoutes(next.children));
      }
      return [...cur, ...nexts];
    }, []);
  }

  private createRoutesMenu(routes: Route[]): MenuItem[] {
    const moduleRoutesItems = routes.map(route => route.data as AppRouteData)
      .filter(data => data != null)
      .map(data => data.menuItem)
      .filter(item => item != null);
    return [
      this.createLoggedUserMenuItem(),
      ...moduleRoutesItems
    ];
  }

  private cloneBaseRouterConfig() {
    const baseRoutes = this.router.config;
    return this.cloneRoutes(baseRoutes);
  }

  private cloneRoutes(routes: Route[]): Route[] {
    return [...routes].map(route => this.cloneRoute(route));
  }

  private cloneRoute(route: Route): Route {
    const clone = Object.assign({}, route);
    if (clone.children != null) {
      clone.children = this.cloneRoutes(clone.children);
    }
    return clone;
  }
}
