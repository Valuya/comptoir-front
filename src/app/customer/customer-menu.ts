import {MenuItem} from 'primeng/api';
import {WsCustomer} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';


export const CustomerListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/customer/list'],
};

export const ResolvedCustomerDetailsMenuItem: MenuItem & ResolvedRouteItem<WsCustomer> = {
  labelFactory: FunctionsUtils.splitDomainObjectCallback<WsCustomer, string>(
    value => `#${value.id}`,
    value => `New item`,
  ),
  routerLinkFactory: RouteUtils.createRouteFactoryFromRouteDataEntities<WsCustomer>(
    FunctionsUtils.splitDomainObjectCallback<WsCustomer, any[]>(
      customer => ['/customer', customer.id]
    ), 'customer'
  ),
  icon: 'fa fa-square',
};

export const CustomerMenuItems: MenuItem[] = [
  CustomerListMenuItem,
  ResolvedCustomerDetailsMenuItem
];
