import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {InvoiceListRouteComponent} from './invoice-list-route/invoice-list-route.component';
import {InvoiceDetailsRouteComponent} from './invoice-details-route/invoice-details-route.component';
import {InvoiceIdResolverService} from './invoice-id-resolver.service';
import {CreateNewInvoiceQuickActionItem, InvoiceListMenuItem, ResolvedInvoiceDetailsMenuItem} from './invoice-menu';
import {AppRoute} from '../util/app-route-data';


export const INVOICE_ROUTES: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: InvoiceListRouteComponent,
    data: {
      menuItem: InvoiceListMenuItem,
      quickActions: [CreateNewInvoiceQuickActionItem]
    }
  },
  {
    path: ':invoiceId',
    component: InvoiceDetailsRouteComponent,
    resolve: {
      invoice: InvoiceIdResolverService
    },
    data: {
      menuItem: ResolvedInvoiceDetailsMenuItem
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(INVOICE_ROUTES)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {
}
