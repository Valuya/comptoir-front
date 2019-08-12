import {MenuItem} from 'primeng/api';
import {WsBalance} from '@valuya/comptoir-ws-api';
import {FunctionsUtils} from '../../util/functions-utils';
import {RouteUtils} from '../../util/route-utils';
import {ResolvedRouteItem} from '../../util/resolved-route-item';


export const BalancesMenuItem = {
  label: 'Balances',
  title: 'Balances',
  icon: 'fa fa-balance-scale',
  routerLink: ['/accounting/balance'],
};

export const CreateNewBalanceQuickActionItem = {
  label: 'Create new balance',
  title: 'Create new balance',
  icon: 'fa fa-plus',
  routerLink: ['/accounting/balance/new'],
};


export const BalanceListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/accounting/balance/list'],
};

export const ResolvedBalanceDetailsMenuItem: MenuItem & ResolvedRouteItem<WsBalance> = {
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsBalance>(
    FunctionsUtils.splitDomainObjectCallback<WsBalance, string>(
      value => `#${value.id}`,
      value => `New balance`,
    ), 'balance'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsBalance>(
    FunctionsUtils.splitDomainObjectCallback<WsBalance, any[]>(
      balance => ['/accounting/balance', balance.id]
    ), 'balance'
  ),
  icon: 'fa fa-square',
};

