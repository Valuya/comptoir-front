import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PosListRouteComponent} from './pos-list-route/pos-list-route.component';
import {PosDetailsRouteComponent} from './pos-details-route/pos-details-route.component';
import {PosIdResolverService} from './pos-id-resolver.service';
import {PosListMenuItem, ResolvedPosDetailsMenuItem} from './pos-menu';


export const POS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: PosListRouteComponent,
    data: {
      menuItem: PosListMenuItem
    }
  },
  {
    path: ':posId',
    component: PosDetailsRouteComponent,
    resolve: {
      pos: PosIdResolverService
    },
    data: {
      menuItem: ResolvedPosDetailsMenuItem
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(POS_ROUTES)],
  exports: [RouterModule]
})
export class PosRoutingModule {
}
