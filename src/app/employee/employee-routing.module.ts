import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {EmployeeListRouteComponent} from './employee-list-route/employee-list-route.component';
import {EmployeeDetailsRouteComponent} from './employee-details-route/employee-details-route.component';
import {EmployeeIdResolverService} from './employee-id-resolver.service';
import {CreateNewEmployeeQuickActionItem, EmployeeListMenuItem, ResolvedEmployeeDetailsMenuItem} from './employee-menu';
import {AppRoute} from '../util/app-route-data';


export const EMPLOYEE_ROUTES: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: EmployeeListRouteComponent,
    data: {
      menuItem: EmployeeListMenuItem,
      quickActions: [CreateNewEmployeeQuickActionItem]
    }
  },
  {
    path: ':employeeId',
    component: EmployeeDetailsRouteComponent,
    resolve: {
      employee: EmployeeIdResolverService
    },
    data: {
      menuItem: ResolvedEmployeeDetailsMenuItem
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(EMPLOYEE_ROUTES)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
