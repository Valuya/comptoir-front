import {ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export class RouteUtils {

  static observeRoutePathData$<T>(routePath: ActivatedRoute[], dataKey: string): Observable<T | null> {
    const data$List = routePath.map(path => path.data);
    return combineLatest(data$List).pipe(
      map(dataList => this.findDataInList(dataList, dataKey))
    );
  }

  static createRouterLinkFactoryFromRouteDataEntities<T, U = any, V = any, W = any>(
    createLink: (...data: [T, U, V, W] | [T, U, V] | [T, U] | [T]) => any[],
    ...params: string[]
  ): (snapshot: RouterStateSnapshot) => any[] {

    return (snapshot: RouterStateSnapshot) => {
      const dataList: [T, U, V, W] = [
        params.length > 0 ? this.findRouteDataOrParamInRouterStateSnapshot(params[0], snapshot) as T : null,
        params.length > 0 ? this.findRouteDataOrParamInRouterStateSnapshot(params[1], snapshot) as U : null,
        params.length > 0 ? this.findRouteDataOrParamInRouterStateSnapshot(params[2], snapshot) as V : null,
        params.length > 0 ? this.findRouteDataOrParamInRouterStateSnapshot(params[3], snapshot) as W : null,
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
        params.length > 0 ? this.findRouteDataOrParamInRouterStateSnapshot(params[0], snapshot) as T : null,
        params.length > 0 ? this.findRouteDataOrParamInRouterStateSnapshot(params[1], snapshot) as U : null,
        params.length > 0 ? this.findRouteDataOrParamInRouterStateSnapshot(params[2], snapshot) as V : null,
        params.length > 0 ? this.findRouteDataOrParamInRouterStateSnapshot(params[3], snapshot) as W : null,
      ];
      const label = createLabel(...dataList);
      return label;
    };
  }


  static findRouteDataInRouteSnapshotAncestors<T>(routePath: ActivatedRouteSnapshot[], dataKey: string): T | null {
    for (let i = routePath.length - 1; i >= 0; i--) {
      const pathRoute = routePath[i];
      const value = pathRoute.data[dataKey];
      if (value != null) {
        return value;
      }
    }
    return null;
  }

  static findRouteParamsInRouteSnapshotAncestors<T>(routePath: ActivatedRouteSnapshot[], dataKey: string): T | null {
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

  private static findDataInList(dataList, dataKey: string) {
    for (let i = dataList.length - 1; i >= 0; i--) {
      const data = dataList[i];
      const value = data[dataKey];
      if (value != null) {
        return value;
      }
    }
    return null;
  }

  private static reduceRoutePathFromRoot(cur: ActivatedRouteSnapshot[], next: ActivatedRouteSnapshot) {
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

  private static findRouteDataOrParamInRouterStateSnapshot(parmaName: string, snapshot: RouterStateSnapshot) {
    const routePath = [snapshot.root]
      .reduce((cur, next) => this.reduceRoutePathFromRoot(cur, next), []);
    const foundData = this.findRouteDataInRouteSnapshotAncestors(routePath, parmaName);
    const foundParams = this.findRouteParamsInRouteSnapshotAncestors(routePath, parmaName);
    return foundData || foundParams;
  }

}
