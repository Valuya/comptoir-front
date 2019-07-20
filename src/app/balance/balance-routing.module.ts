import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BalanceListRouteComponent} from './balance-list-route/balance-list-route.component';
import {BalanceDetailsRouteComponent} from './balance-details-route/balance-details-route.component';
import {AppRouteData} from '../app-routes';
import {BalanceIdResolverService} from './balance-id-resolver.service';


export const BALANCE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: BalanceListRouteComponent,
    data: {
      menuItem: {
        label: 'List',
        title: 'List',
        icon: 'fa fa-list',
        routerLink: ['/balance/list'],
      }
    } as AppRouteData
  },
  {
    path: ':balanceId',
    component: BalanceDetailsRouteComponent,
    resolve: {
      balance: BalanceIdResolverService
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
  imports: [RouterModule.forChild(BALANCE_ROUTES)],
  exports: [RouterModule]
})
export class BalanceRoutingModule {
}
