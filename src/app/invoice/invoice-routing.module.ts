import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InvoiceListRouteComponent} from './invoice-list-route/invoice-list-route.component';
import {InvoiceDetailsRouteComponent} from './invoice-details-route/invoice-details-route.component';
import {AppRouteData} from '../app-routes';
import {InvoiceIdResolverService} from './invoice-id-resolver.service';


export const INVOICE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: InvoiceListRouteComponent,
    data: {
      menuItem: {
        label: 'List',
        title: 'List',
        icon: 'fa fa-list',
        routerLink: ['/invoice/list'],
      }
    } as AppRouteData
  },
  {
    path: ':invoiceId',
    component: InvoiceDetailsRouteComponent,
    resolve: {
      invoice: InvoiceIdResolverService
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
  imports: [RouterModule.forChild(INVOICE_ROUTES)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {
}
