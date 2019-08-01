import {MenuItem} from 'primeng/api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {WsSale} from '@valuya/comptoir-ws-api';
import {RouteUtils} from '../util/route-utils';
import {FunctionsUtils} from '../util/functions-utils';

export const ComptoirSaleRouteItem: MenuItem & ResolvedRouteItem = {
  label: 'Vente',
  routerLink: ['/comptoir/sale/active'],
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsSale>(
    FunctionsUtils.splitDomainObjectCallback(
      sale => `#${sale.id}`,
      value => `New sale`,
      () => `New sale`,
    ), 'comptoirSale'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsSale>(
    FunctionsUtils.splitDomainObjectCallback<WsSale, any[]>(
      sale => ['/comptoir/sale', sale.id],
      value => ['/comptoir/sale/new'],
      () => ['/comptoir/sale/new'],
    ), 'comptoirSale'
  ),
  icon: 'fa fa-shopping-basket'
};

export const ComptoirInfoRouteItem: MenuItem = {
  label: 'Infos',
  title: 'Infos',
  icon: 'fa fa-info',
  routerLink: ['/comptoir/info']
};


export const ComptoirNewSaleRouteItem: MenuItem = {
  label: 'New sale',
  title: 'New sale',
  icon: 'fa fa-shopping-basket',
  routerLink: ['/comptoir/sale/new']
};

export const ComptoirMenuItems: MenuItem[] = [
  ComptoirInfoRouteItem,
  ComptoirSaleRouteItem,
];
