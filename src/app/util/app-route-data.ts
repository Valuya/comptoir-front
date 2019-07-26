import {MenuItem} from 'primeng/api';
import {ResolvedRouteItem} from './resolved-route-item';
import {Data, Route} from '@angular/router';

export interface AppRouteData {
  menuItem?: MenuItem | MenuItem & ResolvedRouteItem<any>;
  quickActions?: MenuItem[];
}

export interface AppRoute extends Route {
  data?: Data | { [key: string]: AppRouteData };
  children?: AppRoute[];
}

export function createAppRouteData<T>(
  routeMenuItem: MenuItem | ResolvedRouteItem<T>,
  quickActionItems?: MenuItem[]
): AppRouteData {
  return {
    menuItem: routeMenuItem,
    quickActions: quickActionItems
  };
}
