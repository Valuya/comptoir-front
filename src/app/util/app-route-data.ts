import {MenuItem} from 'primeng/api';
import {ResolvedRouteItem} from './resolved-route-item';
import {Data, Route} from '@angular/router';

export interface AppRouteData {
  menuItem?: MenuItem | MenuItem & ResolvedRouteItem<any>;
  quickActions?: (MenuItem | MenuItem & ResolvedRouteItem<any>)[];
}

export interface AppRoute extends Route {
  data?: Data | { [key: string]: AppRouteData };
  children?: AppRoute[];
}

export function createAppRouteData<T>(
  routeMenuItem: MenuItem | ResolvedRouteItem<T>,
  quickActionItems?: (MenuItem | ResolvedRouteItem<T>)[]
): AppRouteData & Data {
  return {
    menuItem: routeMenuItem,
    quickActions: quickActionItems
  };
}
