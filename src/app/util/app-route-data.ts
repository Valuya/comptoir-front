import {MenuItem} from 'primeng/api';
import {ResolvedRouteItem} from './resolved-route-item';

export interface AppRouteData {
  menuItem?: MenuItem | MenuItem & ResolvedRouteItem<any>;
}

export function createAppRouteData<T>(routeMenuItem: MenuItem | ResolvedRouteItem<T>): AppRouteData {
  return {
    menuItem: routeMenuItem
  };
}
