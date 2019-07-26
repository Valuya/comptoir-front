import {MenuItem} from 'primeng/api';
import {WsInvoice} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';


export const CreateNewInvoiceQuickActionItem = {
  label: 'Create new invoice',
  title: 'Create new invoice',
  icon: 'fa fa-plus',
  routerLink: ['/invoice/new'],
};
export const InvoiceListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/invoice/list'],
};

export const ResolvedInvoiceDetailsMenuItem: MenuItem & ResolvedRouteItem<WsInvoice> = {
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsInvoice>(
    FunctionsUtils.splitDomainObjectCallback<WsInvoice, string>(
      value => `#${value.id}`,
      value => `New invoice`,
    ), 'invoice'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsInvoice>(
    FunctionsUtils.splitDomainObjectCallback<WsInvoice, any[]>(
      invoice => ['/invoice', invoice.id]
    ), 'invoice'
  ),
  icon: 'fa fa-square',
};

export const InvoiceMenuItems: MenuItem[] = [
  InvoiceListMenuItem,
  ResolvedInvoiceDetailsMenuItem
];
