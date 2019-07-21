import {MenuItem} from 'primeng/api';
import {WsStock} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';


export const CreateNewStockQuickActionItem = {
  label: 'Create new stock',
  title: 'Create new stock',
  icon: 'fa fa-plus',
  routerLink: ['/stock/new'],
};
export const StockListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/stock/list'],
};

export const ResolvedStockDetailsMenuItem: MenuItem & ResolvedRouteItem<WsStock> = {
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsStock>(
    FunctionsUtils.splitDomainObjectCallback<WsStock, string>(
      value => `#${value.id}`,
      value => `New stock`,
    ), 'stock'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsStock>(
    FunctionsUtils.splitDomainObjectCallback<WsStock, any[]>(
      stock => ['/stock', stock.id]
    ), 'stock'
  ),
  icon: 'fa fa-square',
};

export const StockMenuItems: MenuItem[] = [
  StockListMenuItem,
  ResolvedStockDetailsMenuItem
];