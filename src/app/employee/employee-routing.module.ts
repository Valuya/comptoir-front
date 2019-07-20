import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeeListRouteComponent} from './employee-list-route/employee-list-route.component';
import {EmployeeDetailsRouteComponent} from './employee-details-route/employee-details-route.component';
import {EmployeeIdResolverService} from './employee-id-resolver.service';
import {EmployeeListMenuItem, ResolvedEmployeeDetailsMenuItem} from './employee-menu';


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
      menuItem: EmployeeListMenuItem
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
