import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

export class RouteUtils {


  static createRouterLinkFactoryFromRouteDataEntities<T, U = any, V = any, W = any>(
    createLink: (...data: [T, U, V, W] | [T, U, V] | [T, U] | [T]) => any[],
    ...params: string[]
  ): (snapshot: RouterStateSnapshot) => any[] {

    return (snapshot: RouterStateSnapshot) => {
      const dataList: [T, U, V, W] = [
        params.length > 0 ? this.findRouteDataOrParam(params[0], snapshot) as T : null,
        params.length > 0 ? this.findRouteDataOrParam(params[1], snapshot) as U : null,
        params.length > 0 ? this.findRouteDataOrParam(params[2], snapshot) as V : null,
        params.length > 0 ? this.findRouteDataOrParam(params[3], snapshot) as W : null,
      ];
      const routerLink = createLink(...dataList);
      return routerLink;
    };
  }


  static createLabelFactoryFromRouteDataEntities<T, U = any, V = any, W = any>(
    createLabel: (...data: [T, U, V, W] | [T, U, V] | [T, U] | [T]) => string,
    ...params: string[]
  ): (snapshot: RouterStateSnapshot) => string {

    return (snapshot: RouterStateSnapshot) => {
      const dataList: [T, U, V, W] = [
        params.length > 0 ? this.findRouteDataOrParam(params[0], snapshot) as T : null,
        params.length > 0 ? this.findRouteDataOrParam(params[1], snapshot) as U : null,
        params.length > 0 ? this.findRouteDataOrParam(params[2], snapshot) as V : null,
        params.length > 0 ? this.findRouteDataOrParam(params[3], snapshot) as W : null,
      ];
      const label = createLabel(...dataList);
      return label;
    };
  }


  static findRouteDataOrParam(parmaName: string, snapshot: RouterStateSnapshot) {
    const routePath = [snapshot.root]
      .reduce((cur, next) => this.reduceRoutePathFromRoot(cur, next), []);
    const foundData = this.findRouteDataInAncestors(routePath, parmaName);
    const foundParams = this.findRouteParamsInAncestors(routePath, parmaName);
    return foundData || foundParams;
  }

  static reduceRoutePathFromRoot(cur: ActivatedRouteSnapshot[], next: ActivatedRouteSnapshot) {
    const newValue = [...cur, next];
    const nextChilds = next.children;
    if (nextChilds != null && nextChilds.length > 0) {
      // this wont work with multiple router outlet (multiple child per routes)
      const childItems = nextChilds
        .reduce((childCur, childNext) => this.reduceRoutePathFromRoot(childCur, childNext), []);
      newValue.push(...childItems);
    }
    return newValue;
  }


  static findRouteDataInAncestors<T>(routePath: ActivatedRouteSnapshot[], dataKey: string): T | null {
    for (let i = routePath.length - 1; i >= 0; i--) {
      const pathRoute = routePath[i];
      const value = pathRoute.data[dataKey];
      if (value != null) {
        return value;
      }
    }
    return null;
  }


  static findRouteParamsInAncestors<T>(routePath: ActivatedRouteSnapshot[], dataKey: string): T | null {
    for (let i = routePath.length - 1; i >= 0; i--) {
      const pathRoute = routePath[i];
      const value = pathRoute.params[dataKey];
      if (value != null) {
        return value;
      }
    }
    return null;
  }

  static createRoutePathFromRoot(routerState: RouterStateSnapshot): ActivatedRouteSnapshot[] {
    const rootRoute = routerState.root;
    const routePath = [rootRoute]
      .reduce((cur, next) => RouteUtils.reduceRoutePathFromRoot(cur, next), []);
    return routePath;
  }

}
