import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeeListRouteComponent} from './employee-list-route/employee-list-route.component';
import {EmployeeDetailsRouteComponent} from './employee-details-route/employee-details-route.component';
import {AppRouteData} from '../app-routes';
import {EmployeeIdResolverService} from './employee-id-resolver.service';


export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: EmployeeListRouteComponent,
    data: {
      menuItem: {
        label: 'List',
        title: 'List',
        icon: 'fa fa-list',
        routerLink: ['/employee/list'],
      }
    } as AppRouteData
  },
  {
    path: ':employeeId',
    component: EmployeeDetailsRouteComponent,
    resolve: {
      employee: EmployeeIdResolverService
    },
    data: {
      menuItem: {
        label: 'Details',
        title: 'Details',
        icon: 'fa fa-shopping-cart',
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(EMPLOYEE_ROUTES)],
  exports: [RouterModule]
})
export class EmployeeRoutingModule {
}
