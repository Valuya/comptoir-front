import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {AppRoute, createAppRouteData} from '../util/app-route-data';
import {CompanyDetailsMenuItem, ResolvedCompanyDetailsMenuItem, ResolvedCompanyPrestashopMenuItem} from './company-menu';
import {CompanyDetailsRouteComponent} from './company-details-route/company-details-route.component';
import {CompanyIdResolverService} from './company-id-resolver.service';
import {PresathopImportComponent} from './presathop-import/presathop-import.component';
import {AppMenu} from '../app-menu';


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
    data: createAppRouteData(ResolvedCompanyDetailsMenuItem),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'details'
      },
      {
        path: 'details',
        component: CompanyDetailsRouteComponent,
        data: createAppRouteData(CompanyDetailsMenuItem, [ResolvedCompanyPrestashopMenuItem]),
      },
      {
        path: 'import',
        component: PresathopImportComponent,
        data: createAppRouteData(ResolvedCompanyPrestashopMenuItem),
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
