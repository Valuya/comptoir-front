import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppRoute, createAppRouteData} from '../util/app-route-data';
import {AccountingEntryListRouteComponent} from './accounting-entry-list-route/accounting-entry-list-route.component';
import {AccountingEntriesMenuItem, AccountingEntriesListItem} from './accounting-menu';
import {AccountingEntrySearchFilterResolverService} from './accounting-entry-search-filter-resolver.service';
import {AppMenu} from '../app-menu';
import {BalancesMenuItem} from './balance/balance-menu';
import {AccountsMenuitem} from './account/account-menu';


const ACCOUNTING_ENTRIES_ROUTES: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: AccountingEntryListRouteComponent,
    data: createAppRouteData(AccountingEntriesListItem),
    resolve: {
      accountingEntrySearchFilter: AccountingEntrySearchFilterResolverService
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  }
];

const ACCOUNTING_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'entry/list'
  },
  {
    path: 'entry',
    data: createAppRouteData(AccountingEntriesMenuItem),
    children: ACCOUNTING_ENTRIES_ROUTES
  },
  {
    path: 'balance',
    loadChildren: './balance/balance.module#BalanceModule',
    data: createAppRouteData(BalancesMenuItem)
  },
  {
    path: 'account',
    loadChildren: './account/account.module#AccountModule',
    data: createAppRouteData(AccountsMenuitem)
  },
];

@NgModule({
  imports: [RouterModule.forChild(ACCOUNTING_ROUTES)],
  exports: [RouterModule]
})
export class AccountingRoutingModule {
}
