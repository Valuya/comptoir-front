import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StockListRouteComponent} from './stock-list-route/stock-list-route.component';
import {StockDetailsRouteComponent} from './stock-details-route/stock-details-route.component';
import {StockIdResolverService} from './stock-id-resolver.service';
import {ResolvedStockDetailsMenuItem, StockListMenuItem} from './stock-menu';


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
      menuItem: StockListMenuItem
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
