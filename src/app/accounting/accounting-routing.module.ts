import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AppRoute, createAppRouteData} from '../util/app-route-data';
import {AccountingEntryListRouteComponent} from './accounting-entry-list-route/accounting-entry-list-route.component';
import {AccountingEntriesItem, AccountingEntriesListItem} from './accounting-menu';
import {AccountingEntrySearchFilterResolverService} from './accounting-entry-search-filter-resolver.service';


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
    data: createAppRouteData(AccountingEntriesItem),
    children: ACCOUNTING_ENTRIES_ROUTES
  }
];

@NgModule({
  imports: [RouterModule.forChild(ACCOUNTING_ROUTES)],
  exports: [RouterModule]
})
export class AccountingRoutingModule {
}
