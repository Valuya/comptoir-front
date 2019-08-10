import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppRoute} from '../util/app-route-data';
import {CompanyDetailsMenuItem, ResolvedCompanyDetailsMenuItem} from './company-menu';
import {CompanyDetailsRouteComponent} from './company-details-route/company-details-route.component';
import {CompanyIdResolverService} from './company-id-resolver.service';


export const CompanyRoutes: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'mine/details'
  },
  {
    path: ':companyId',
    resolve: {
      company: CompanyIdResolverService
    },
    data: {
      menuItem: ResolvedCompanyDetailsMenuItem
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'details'
      },
      {
        path: 'details',
        component: CompanyDetailsRouteComponent,
        data: {
          menuItem: CompanyDetailsMenuItem
        },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(CompanyRoutes)],
  exports: [RouterModule]
})
export class CompanyRoutingModule {
}
