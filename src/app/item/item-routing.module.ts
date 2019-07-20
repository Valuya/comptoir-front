import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {ITEM_ROUTES} from './item-routes';


@NgModule({
  imports: [RouterModule.forChild(ITEM_ROUTES)],
  exports: [RouterModule]
})
export class ItemRoutingModule {
}
