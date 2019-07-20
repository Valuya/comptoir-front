import {MenuItem} from 'primeng/api';
import {WsInvoice} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';


export const InvoiceListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/invoice/list'],
};

export const ResolvedInvoiceDetailsMenuItem: MenuItem & ResolvedRouteItem<WsInvoice> = {
  labelFactory: FunctionsUtils.splitDomainObjectCallback<WsInvoice, string>(
    value => `#${value.id}`,
    value => `New invoice`,
  ),
  routerLinkFactory: RouteUtils.createRouteFactoryFromRouteDataEntities<WsInvoice>(
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
