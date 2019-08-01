import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ComptoirSaleRouteComponent} from './comptoir-sale-route/comptoir-sale-route.component';
import {AppRoute, createAppRouteData} from '../util/app-route-data';
import {ComptoirInfoRouteItem, ComptoirNewSaleRouteItem, ComptoirSaleRouteItem} from './comptoir-menu';
import {ComptoirSaleIdResolverService} from './comptoir-sale-id-resolver.service';
import {ComptoirInfoRouteComponent} from './comptoir-info-route/comptoir-info-route.component';
import {ComptoirSaleFillRouteComponent} from './comptoir-sale-fill-route/comptoir-sale-fill-route.component';
import {ComptoirSalePayRouteComponent} from './comptoir-sale-pay-route/comptoir-sale-pay-route.component';

export const ComptoirSaleRoutes: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'fill'
  },
  {
    path: 'fill',
    component: ComptoirSaleFillRouteComponent,
  },
  {
    path: 'pay',
    component: ComptoirSalePayRouteComponent,
  }
];

export const ComptoirRoutes: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'sale/active'
  },
  {
    path: 'sale',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'active'
      },
      {
        path: ':comptoirSaleId',
        resolve: {
          comptoirSale: ComptoirSaleIdResolverService,
        },
        component: ComptoirSaleRouteComponent,
        data: createAppRouteData(ComptoirSaleRouteItem, [ComptoirNewSaleRouteItem]),
        children: ComptoirSaleRoutes
      },
      {
        path: '*',
        resolve: {
          comptoirSale: ComptoirSaleIdResolverService,
        },
        component: ComptoirSaleRouteComponent,
        data: createAppRouteData(ComptoirSaleRouteItem, [ComptoirNewSaleRouteItem]),
      }
    ]
  },
  {
    path: 'info',
    component: ComptoirInfoRouteComponent,
    data: createAppRouteData(ComptoirInfoRouteItem)
  }
];

@NgModule({
  imports: [RouterModule.forChild(ComptoirRoutes)],
  exports: [RouterModule]
})
export class ComptoirRoutingModule {
}
