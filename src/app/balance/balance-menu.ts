import {MenuItem} from 'primeng/api';
import {WsBalance} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';


export const BalanceListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/balance/list'],
};

export const ResolvedBalanceDetailsMenuItem: MenuItem & ResolvedRouteItem<WsBalance> = {
  labelFactory: FunctionsUtils.splitDomainObjectCallback<WsBalance, string>(
    value => `#${value.id}`,
    value => `New item`,
  ),
  routerLinkFactory: RouteUtils.createRouteFactoryFromRouteDataEntities<WsBalance>(
    FunctionsUtils.splitDomainObjectCallback<WsBalance, any[]>(
      balance => ['/balance', balance.id]
    ), 'balance'
  ),
  icon: 'fa fa-square',
};

export const BalanceMenuItems: MenuItem[] = [
  BalanceListMenuItem,
  ResolvedBalanceDetailsMenuItem
];
