import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomerListRouteComponent} from './customer-list-route/customer-list-route.component';
import {CustomerDetailsRouteComponent} from './customer-details-route/customer-details-route.component';
import {AppRouteData} from '../app-routes';
import {CustomerIdResolverService} from './customer-id-resolver.service';


export const CUSTOMER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: CustomerListRouteComponent,
    data: {
      menuItem: {
        label: 'List',
        title: 'List',
        icon: 'fa fa-list',
        routerLink: ['/customer/list'],
      }
    } as AppRouteData
  },
  {
    path: ':customerId',
    component: CustomerDetailsRouteComponent,
    resolve: {
      customer: CustomerIdResolverService
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
  imports: [RouterModule.forChild(CUSTOMER_ROUTES)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {
}
