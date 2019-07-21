import {MenuItem} from 'primeng/api';
import {WsBalance, WsPos} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';


export const PosListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/pos/list'],
};

export const ResolvedPosDetailsMenuItem: MenuItem & ResolvedRouteItem<WsPos> = {
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsPos>(
    FunctionsUtils.splitDomainObjectCallback<WsPos, string>(
      value => `#${value.id}`,
      value => `New pos`,
    ), 'pos'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsPos>(
    FunctionsUtils.splitDomainObjectCallback<WsPos, any[]>(
      pos => ['/pos', pos.id]
    ), 'pos'
  ),
  icon: 'fa fa-square',
};

export const PosMenuItems: MenuItem[] = [
  PosListMenuItem,
  ResolvedPosDetailsMenuItem
];
