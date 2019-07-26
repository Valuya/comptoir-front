import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StockListRouteComponent} from './stock-list-route/stock-list-route.component';
import {StockDetailsRouteComponent} from './stock-details-route/stock-details-route.component';
import {StockIdResolverService} from './stock-id-resolver.service';
import {CreateNewStockQuickActionItem, ResolvedStockDetailsMenuItem, StockListMenuItem} from './stock-menu';
import {AppRoute} from '../util/app-route-data';


export const STOCK_ROUTES: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: StockListRouteComponent,
    data: {
      menuItem: StockListMenuItem,
      quickActions: [CreateNewStockQuickActionItem]
    }
  },
  {
    path: ':stockId',
    component: StockDetailsRouteComponent,
    resolve: {
      stock: StockIdResolverService
    },
    data: {
      menuItem: ResolvedStockDetailsMenuItem
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(STOCK_ROUTES)],
  exports: [RouterModule]
})
export class StockRoutingModule {
}
