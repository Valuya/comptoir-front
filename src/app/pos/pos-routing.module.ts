import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PosListRouteComponent} from './pos-list-route/pos-list-route.component';
import {PosDetailsRouteComponent} from './pos-details-route/pos-details-route.component';
import {PosIdResolverService} from './pos-id-resolver.service';
import {CreateNewPosQuickActionItem, PosListMenuItem, ResolvedPosDetailsMenuItem} from './pos-menu';
import {AppRoute} from '../util/app-route-data';


export const POS_ROUTES: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: PosListRouteComponent,
    data: {
      menuItem: PosListMenuItem,
      quickActions: [CreateNewPosQuickActionItem]
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
