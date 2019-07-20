import {MenuItem} from 'primeng/api';
import {WsEmployee} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';


export const EmployeeListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/employee/list'],
};

export const ResolvedEmployeeDetailsMenuItem: MenuItem & ResolvedRouteItem<WsEmployee> = {
  labelFactory: FunctionsUtils.splitDomainObjectCallback<WsEmployee, string>(
    value => `#${value.id}`,
    value => `New employee`,
  ),
  routerLinkFactory: RouteUtils.createRouteFactoryFromRouteDataEntities<WsEmployee>(
    FunctionsUtils.splitDomainObjectCallback<WsEmployee, any[]>(
      employee => ['/employee', employee.id]
    ), 'employee'
  ),
  icon: 'fa fa-square',
};

export const EmployeeMenuItems: MenuItem[] = [
  EmployeeListMenuItem,
  ResolvedEmployeeDetailsMenuItem
];
