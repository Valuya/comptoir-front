import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {STOCK_ROUTES} from './stock-routes';


@NgModule({
  imports: [RouterModule.forChild(STOCK_ROUTES)],
  exports: [RouterModule]
})
export class StockRoutingModule {
}
