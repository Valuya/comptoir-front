import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SaleListRouteComponent} from './sale-list-route/sale-list-route.component';
import {SaleDetailsRouteComponent} from './sale-details-route/sale-details-route.component';
import {AppRouteData} from '../app-routes';
import {SaleIdResolverService} from './sale-id-resolver.service';


export const SALE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: SaleListRouteComponent,
    data: {
      menuItem: {
        label: 'List',
        title: 'List',
        icon: 'fa fa-list',
        routerLink: ['/sale/list'],
      }
    } as AppRouteData
  },
  {
    path: ':saleId',
    component: SaleDetailsRouteComponent,
    resolve: {
      sale: SaleIdResolverService
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
  imports: [RouterModule.forChild(SALE_ROUTES)],
  exports: [RouterModule]
})
export class SaleRoutingModule {
}
