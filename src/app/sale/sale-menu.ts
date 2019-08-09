import {MenuItem} from 'primeng/api';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';
import {WsBalance, WsItemVariantSale, WsPos, WsSale} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';


export const SaleDetailsVariantListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsSale>(
    FunctionsUtils.splitDomainObjectCallback<WsSale, any[]>(
      sale => ['/sale', sale.id, 'variant', 'list']
    ), 'sale'
  ),
};

export const ResolvedSaleDetailsVariantDetailsMenuItem: MenuItem & ResolvedRouteItem<WsItemVariantSale> = {
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsItemVariantSale>(
    FunctionsUtils.splitDomainObjectCallback<WsItemVariantSale, string>(
      value => `#${value.id}`,
      value => `New variant`,
    ), 'sale'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsSale, WsItemVariantSale>(
    (sale, variant) => (sale == null || variant == null) ? [] : ['/sale', sale.id, 'variant', variant.id],
    'sale', 'saleVariant'
  ),
  icon: 'fa fa-shoppingw-basket',
};

const SaleDetailVariantMenuItems: MenuItem[] = [
  SaleDetailsVariantListMenuItem,
  ResolvedSaleDetailsVariantDetailsMenuItem
];

export const ResolvedSaleDetailsDetailsMenuItem: MenuItem & ResolvedRouteItem<WsSale> = {
  label: 'Details',
  title: 'Details',
  icon: 'fa fa-shopping-cart',
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsSale>(
    FunctionsUtils.splitDomainObjectCallback<WsSale, any[]>(
      sale => ['/sale', sale.id]
    ), 'sale'
  ),
};

export const ResolvedSaleDetailsBillMenuItem: MenuItem & ResolvedRouteItem<WsSale> = {
  label: 'Bill',
  title: 'Bill',
  icon: 'fa fa-list',
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsSale>(
    FunctionsUtils.splitDomainObjectCallback<WsSale, any[]>(
      sale => ['/sale', sale.id, 'bill']
    ), 'sale'
  ),
};

export const PrintMenuItem: MenuItem & ResolvedRouteItem<WsSale> = {
  label: 'Print',
  title: 'Print',
  icon: 'fa fa-print',
  command: () => window.print()
};

export const SaleDetailsVariantsMenuItem: MenuItem & ResolvedRouteItem<WsSale> = {
  label: 'Content',
  title: 'Content',
  icon: 'fa fa-shopping-basket',
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsSale>(
    FunctionsUtils.splitDomainObjectCallback<WsSale, any[]>(
      sale => ['/sale', sale.id, 'variant', 'list']
    ), 'sale'
  ),
  items: SaleDetailVariantMenuItems
};
export const SaleDetailMenuItems: MenuItem[] = [
  ResolvedSaleDetailsDetailsMenuItem,
  ResolvedSaleDetailsBillMenuItem,
  SaleDetailsVariantsMenuItem
];

export const SaleListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/sale/list'],
};

export const ResolvedSaleDetailsMenuItem: MenuItem & ResolvedRouteItem<WsSale> = {
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsSale>(
    FunctionsUtils.splitDomainObjectCallback<WsSale, string>(
      value => `#${value.id}`,
      value => `New sale`,
    ), 'sale'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsSale>(
    FunctionsUtils.splitDomainObjectCallback<WsSale, any[]>(
      sale => ['/sale', sale.id]
    ), 'sale'
  ),
  icon: 'fa fa-shopping-cart',
  items: SaleDetailMenuItems
};

export const SaleMenuItems: MenuItem[] = [
  SaleListMenuItem,
  ResolvedSaleDetailsMenuItem
];
