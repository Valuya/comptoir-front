import {MenuItem} from 'primeng/api';
import {WsAccount, WsEmployee} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';


export const CreateNewAccountQuickActionItem = {
  label: 'Create new account',
  title: 'Create new account',
  icon: 'fa fa-plus',
  routerLink: ['/account/new'],
};

export const AccountListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/account/list'],
};

export const ResolvedAccountDetailsMenuItem: MenuItem & ResolvedRouteItem<WsAccount> = {
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsAccount>(
    FunctionsUtils.splitDomainObjectCallback<WsAccount, string>(
      value => `#${value.id}`,
      value => `New account`,
    ), 'account'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsAccount>(
    FunctionsUtils.splitDomainObjectCallback<WsAccount, any[]>(
      account => ['/account', account.id]
    ), 'account'
  ),
  icon: 'fa fa-square',
};

export const AccountMenuItems: MenuItem[] = [
  AccountListMenuItem,
  ResolvedAccountDetailsMenuItem
];
