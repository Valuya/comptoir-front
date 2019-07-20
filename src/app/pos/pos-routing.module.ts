import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppRouteData} from '../app-routes';
import {PosIdResolverService} from './pos-id-resolver.service';
import {PoDetailsRouteComponent} from './pos-details-route/pos-details-route.component';
import {PoListRouteComponent} from './pos-list-route/pos-list-route.component';


export const POS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: PoListRouteComponent,
    data: {
      menuItem: {
        label: 'List',
        title: 'List',
        icon: 'fa fa-list',
        routerLink: ['/pos/list'],
      }
    } as AppRouteData
  },
  {
    path: ':posId',
    component: PoDetailsRouteComponent,
    resolve: {
      pos: PosIdResolverService
    },
    data: {
      menuItem: {
        label: 'Details',
        title: 'Details',
        icon: 'fa fa-building',
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(POS_ROUTES)],
  exports: [RouterModule]
})
export class PosRoutingModule {
}
