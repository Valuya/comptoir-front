import {MenuItem} from 'primeng/api';
import {WsStock} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';


export const StockListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/stock/list'],
};

export const ResolvedStockDetailsMenuItem: MenuItem & ResolvedRouteItem<WsStock> = {
  labelFactory: FunctionsUtils.splitDomainObjectCallback<WsStock, string>(
    value => `#${value.id}`,
    value => `New item`,
  ),
  routerLinkFactory: RouteUtils.createRouteFactoryFromRouteDataEntities<WsStock>(
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
