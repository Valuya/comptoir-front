import {MenuItem} from 'primeng/api';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';
import {WsItemVariantStock, WsStock} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';


export const StockDetailsVariantListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsStock>(
    FunctionsUtils.splitDomainObjectCallback<WsStock, any[]>(
      stock => ['/stock', stock.id, 'variant', 'list']
    ), 'stock'
  ),
};

export const ResolvedStockDetailsVariantDetailsMenuItem: MenuItem & ResolvedRouteItem<WsItemVariantStock> = {
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsItemVariantStock>(
    FunctionsUtils.splitDomainObjectCallback<WsItemVariantStock, string>(
      value => `#${value.id}`,
      value => `New variant`,
    ), 'stock'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsStock, WsItemVariantStock>(
    (stock, variant) => (stock == null || variant == null) ? [] : ['/stock', stock.id, 'variant', variant.id],
    'stock', 'stockVariant'
  ),
  icon: 'fa fa-hand-spock-o',
};

const StockDetailVariantMenuItems: MenuItem[] = [
  StockDetailsVariantListMenuItem,
  ResolvedStockDetailsVariantDetailsMenuItem
];

export const ResolvedStockDetailsDetailsMenuItem: MenuItem & ResolvedRouteItem<WsStock> = {
  label: 'Details',
  title: 'Details',
  icon: 'fa fa-hand-spock-o',
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsStock>(
    FunctionsUtils.splitDomainObjectCallback<WsStock, any[]>(
      stock => ['/stock', stock.id]
    ), 'stock'
  ),
};

export const StockDetailsVariantsMenuItem: MenuItem & ResolvedRouteItem<WsStock> = {
  label: 'Content',
  title: 'Content',
  icon: 'fa fa-hand-spock-o',
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsStock>(
    FunctionsUtils.splitDomainObjectCallback<WsStock, any[]>(
      stock => ['/stock', stock.id, 'variant', 'list']
    ), 'stock'
  ),
  items: StockDetailVariantMenuItems
};
export const StockDetailMenuItems: MenuItem[] = [
  ResolvedStockDetailsDetailsMenuItem,
  StockDetailsVariantsMenuItem
];

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
  icon: 'fa fa-hand-spock-o',
  items: StockDetailMenuItems
};

export const StockMenuItems: MenuItem[] = [
  StockListMenuItem,
  ResolvedStockDetailsMenuItem
];
