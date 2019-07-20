import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CustomerListRouteComponent} from './customer-list-route/customer-list-route.component';
import {CustomerDetailsRouteComponent} from './customer-details-route/customer-details-route.component';
import {CustomerIdResolverService} from './customer-id-resolver.service';
import {CustomerListMenuItem, ResolvedCustomerDetailsMenuItem} from './customer-menu';


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
      menuItem: CustomerListMenuItem
    }
  },
  {
    path: ':customerId',
    component: CustomerDetailsRouteComponent,
    resolve: {
      customer: CustomerIdResolverService
    },
    data: {
      menuItem: ResolvedCustomerDetailsMenuItem
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(CUSTOMER_ROUTES)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {
}
