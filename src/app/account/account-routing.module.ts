import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AccountListRouteComponent} from './account-list-route/account-list-route.component';
import {AccountDetailsRouteComponent} from './account-details-route/account-details-route.component';
import {AccountIdResolverService} from './account-id-resolver.service';
import {AccountListMenuItem, CreateNewAccountQuickActionItem, ResolvedAccountDetailsMenuItem} from './account-menu';
import {AppRoute} from '../util/app-route-data';


export const ACCOUNT_ROUTES: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: AccountListRouteComponent,
    data: {
      menuItem: AccountListMenuItem,
      quickActions: [CreateNewAccountQuickActionItem]
    }
  },
  {
    path: ':accountId',
    component: AccountDetailsRouteComponent,
    resolve: {
      account: AccountIdResolverService
    },
    data: {
      menuItem: ResolvedAccountDetailsMenuItem
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ACCOUNT_ROUTES)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
