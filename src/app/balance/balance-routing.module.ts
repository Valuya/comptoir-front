import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BalanceListRouteComponent} from './balance-list-route/balance-list-route.component';
import {BalanceDetailsRouteComponent} from './balance-details-route/balance-details-route.component';
import {BalanceIdResolverService} from './balance-id-resolver.service';
import {BalanceListMenuItem, ResolvedBalanceDetailsMenuItem} from './balance-menu';


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
      menuItem: BalanceListMenuItem
    }
  },
  {
    path: ':balanceId',
    component: BalanceDetailsRouteComponent,
    resolve: {
      balance: BalanceIdResolverService
    },
    data: {
      menuItem: ResolvedBalanceDetailsMenuItem
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(BALANCE_ROUTES)],
  exports: [RouterModule]
})
export class BalanceRoutingModule {
}
