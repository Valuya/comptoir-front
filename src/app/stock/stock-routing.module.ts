import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StockListRouteComponent} from './stock-list-route/stock-list-route.component';
import {StockDetailsRouteComponent} from './stock-details-route/stock-details-route.component';
import {AppRouteData} from '../app-routes';
import {StockIdResolverService} from './stock-id-resolver.service';


export const STOCK_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: StockListRouteComponent,
    data: {
      menuItem: {
        label: 'List',
        title: 'List',
        icon: 'fa fa-list',
        routerLink: ['/stock/list'],
      }
    } as AppRouteData
  },
  {
    path: ':stockId',
    component: StockDetailsRouteComponent,
    resolve: {
      stock: StockIdResolverService
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
  imports: [RouterModule.forChild(STOCK_ROUTES)],
  exports: [RouterModule]
})
export class StockRoutingModule {
}
