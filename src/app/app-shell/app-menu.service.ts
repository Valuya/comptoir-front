import {Injectable, Type} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {BehaviorSubject, concat, Observable, of} from 'rxjs';
import {ActivatedRouteSnapshot, ActivationStart, ResolveEnd, Route, Router, RouterStateSnapshot} from '@angular/router';
import {distinctUntilChanged, filter, map, mergeMap, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {AppMenu} from '../app-menu';
import {AppRouteData} from '../util/app-route-data';
import {RouteUtils} from '../util/route-utils';
import {ResolvedRouteItem} from '../util/resolved-route-item';

@Injectable({
  providedIn: 'root'
})
export class AppMenuService {

  appMenu$: Observable<MenuItem[]>;
  breadcrumbMenu$: Observable<MenuItem[]>;
  quickActions$: Observable<MenuItem[]>;

  appMenuCollapsed$ = new BehaviorSubject<boolean>(false);

  constructor(private router: Router,
              private authService: AuthService
  ) {
    this.appMenu$ = this.authService.getLoggedEmployee$().pipe(
      distinctUntilChanged(),
      switchMap(employee => this.createAppMenu$(employee)),
      publishReplay(1), refCount()
    );

    const routeActivationEvents$ = this.router.events.pipe(
      mergeMap(event => this.filterActivationEvent(event)),
      filter(e => e != null),
      publishReplay(1), refCount()
    );

    const activatedRoutePath = RouteUtils.createRoutePathFromRoot(this.router.routerState.snapshot);
    const activatedRouteMenu = this.createMenuFromRootPath(activatedRoutePath);
    const nextActivatedRoutesMenu$ = routeActivationEvents$.pipe(
      map(event => this.createMenuFromRouteEvent(event)),
      publishReplay(1), refCount()
    );
    this.breadcrumbMenu$ = concat(of(activatedRouteMenu), nextActivatedRoutesMenu$);


    this.quickActions$ = routeActivationEvents$.pipe(
      map(event => this.createQuickActionMenuFromRouteEvent(event)),
      publishReplay(1), refCount()
    );
  }

  cloneMenuItem(menuItem: MenuItem | any) {
    if (menuItem == null) {
      return null;
    }
    const cloneItem: MenuItem = Object.assign({}, menuItem);
    return cloneItem;
  }

  collapseAppMenu() {
    this.appMenuCollapsed$.next(true);
  }

  expandAppMenu() {
    this.appMenuCollapsed$.next(false);
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

  private createAppMenu$(loggeduser?: any): Observable<MenuItem[]> {
    const mainMenuSections = Object.keys(AppMenu);
    const routerState = this.router.routerState;
    const routePath = RouteUtils.createRoutePathFromRoot(routerState.snapshot);
    const lastRouteChild = routePath.length === 0 ? null : routePath[routePath.length - 1];
    if (lastRouteChild == null) {
      return of([]);
    }

    const mainMenu = mainMenuSections
      .map(section => this.createMenuSection(section))
      .map(section => this.updateMenuItemFromRouteSnapshot(section, lastRouteChild));

    return of([
      this.createCollapseMenuItem(),
      ...mainMenu
    ]);
  }


  private createCollapseMenuItem() {
    return {
      icon: 'fa fa-chevron-left',
      label: 'Hide',
      title: 'Hide',
      command: () => this.collapseAppMenu()
    };
  }

  private createMenuSection(section: string) {
    let menuItem = AppMenu[section];
    menuItem = this.filterForAppMenu(menuItem);
    return menuItem;
  }

  private filterForAppMenu(menuItem: MenuItem | ResolvedRouteItem<any>) {
    if (menuItem == null) {
      return null;
    }
    const newItem = this.cloneMenuItem(menuItem);
    const children = newItem.items as MenuItem[];
    if (children != null) {
      newItem.items = [...children]
        .map(item => this.filterForAppMenu(item))
        .filter(item => item != null);
    }
    const newChildren = newItem.items;

    const isEmpty = newItem.routerLink == null;
    const isLeaf = newChildren == null || newChildren.length === 0;
    if (isEmpty && isLeaf) { // kepp empty intermediate nodes that are labbelled
      return null;
    }
    return newItem;
  }

  private filterActivationEvent(event: any): Observable<ActivationStart | ResolveEnd> {
    if (event instanceof ActivationStart) {
      return of(event as ActivationStart);
    } else if (event instanceof ResolveEnd) {
      return of(event as ResolveEnd);
    } else {
      return of(null);
    }
  }


  private createMenuFromRootPath(routePath: ActivatedRouteSnapshot[]) {
    return routePath
      .filter(snapshot => snapshot.data != null)
      .map(snapshot => this.createAppMenuItemFromRouteSnapshot(snapshot))
      .filter(item => item != null);
  }


  private createAppMenuItemFromRouteSnapshot(snapshot: ActivatedRouteSnapshot): MenuItem | null {
    const data = snapshot.data as AppRouteData;
    if (data == null || data.menuItem == null) {
      return null;
    }
    return this.updateMenuItemFromRouteSnapshot(data.menuItem, snapshot);
  }

  updateMenuItemFromRouteSnapshot(item: ResolvedRouteItem<any> | MenuItem, snapshot: ActivatedRouteSnapshot): MenuItem | null {
    const newItem = this.cloneMenuItem(item);
    let resolvedItem: ResolvedRouteItem<any> & MenuItem = newItem as ResolvedRouteItem<any> & MenuItem;
    const emptyResolvedItem = resolvedItem.labelFactory == null && resolvedItem.routerLinkFactory == null;
    if (emptyResolvedItem) {
      resolvedItem = null;
    }

    if (resolvedItem != null) {

      // Label
      if (resolvedItem.labelFactory != null) {
        const createdLabel = resolvedItem.labelFactory(snapshot);
        resolvedItem.label = createdLabel;
        resolvedItem.title = createdLabel;
      }

      // Router link
      if (resolvedItem.routerLinkFactory != null) {
        const routerLinkValue = resolvedItem.routerLinkFactory(snapshot);
        resolvedItem.routerLink = routerLinkValue;
      }

    }

    const newItemChilds = newItem.items as MenuItem[];
    if (newItemChilds != null && newItemChilds.length > 0) {
      newItem.items = [
        ...newItemChilds.map(newItemChild => this.updateMenuItemFromRouteSnapshot(newItemChild, snapshot))
      ];
    }

    return newItem;
  }

  private createMenuFromRouteEvent(event: ActivationStart | ResolveEnd) {
    if (event instanceof ActivationStart) {
      const routePath = event.snapshot.pathFromRoot;
      return this.createMenuFromRootPath(routePath);
    } else if (event instanceof ResolveEnd) {
      const routePath = RouteUtils.createRoutePathFromRoot(event.state);
      return this.createMenuFromRootPath(routePath);
    }
  }

  private createQuickActionMenuFromRouteEvent(event: ActivationStart | ResolveEnd) {
    if (event instanceof ActivationStart) {
      const routePath = event.snapshot.pathFromRoot;
      return this.createQuickActionsFromRoutePath(routePath);
    } else if (event instanceof ResolveEnd) {
      const routePath = RouteUtils.createRoutePathFromRoot(event.state);
      return this.createQuickActionsFromRoutePath(routePath);
    }
  }

  private createQuickActionsFromRoutePath(routePath: ActivatedRouteSnapshot[]): MenuItem[] {
    return routePath
      .filter(snapshot => snapshot.data != null)
      .map(snapshot => this.createQuickActionItemFromRouteSnapshot(snapshot))
      .reduce((c, n) => [...c, ...n], []);
  }

  private createQuickActionItemFromRouteSnapshot(snapshot: ActivatedRouteSnapshot): MenuItem[] {
    const data = snapshot.data as AppRouteData;
    if (data == null || data.quickActions == null) {
      return [];
    }
    return data.quickActions.map(action => this.resolveQuickAction(action, snapshot));

  }

  private resolveQuickAction(action: MenuItem | (MenuItem & ResolvedRouteItem<any>), snapshot: ActivatedRouteSnapshot) {
    const resolvedItem: ResolvedRouteItem<any> & MenuItem = action as ResolvedRouteItem<any> & MenuItem;
    const emptyResolvedItem = resolvedItem.labelFactory == null && resolvedItem.routerLinkFactory == null;
    if (emptyResolvedItem) {
      return action;
    }

    if (resolvedItem != null) {

      // Label
      if (resolvedItem.labelFactory != null) {
        const createdLabel = resolvedItem.labelFactory(snapshot);
        resolvedItem.label = createdLabel;
        resolvedItem.title = createdLabel;
      }

      // Router link
      if (resolvedItem.routerLinkFactory != null) {
        const routerLinkValue = resolvedItem.routerLinkFactory(snapshot);
        resolvedItem.routerLink = routerLinkValue;
      }

    }
    return resolvedItem;
  }
}
