import {MenuItem} from 'primeng/api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {WsCompany} from '@valuya/comptoir-ws-api';
import {RouteUtils} from '../util/route-utils';
import {FunctionsUtils} from '../util/functions-utils';

export const MyCompanyMenuItem: MenuItem = {
  label: 'My company',
  title: 'My company',
  icon: 'fa fa-building',
  routerLink: ['/company/mine']
};


export const CompanyDetailsMenuItem: MenuItem = {
  label: 'Details',
  title: 'Details',
  icon: 'fa fa-edit',
};

export const ResolvedCompanyPrestashopMenuItem: MenuItem & ResolvedRouteItem<WsCompany> = {
  label: 'Import prestashop',
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsCompany>(
    FunctionsUtils.splitDomainObjectCallback<WsCompany, any[]>(
      company => ['/company', company.id, 'import']
    ), 'company'
  ),
  icon: 'fa fa-download',
};


export const ResolvedCompanyDetailsMenuItem: MenuItem & ResolvedRouteItem<WsCompany> = {
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsCompany>(
    FunctionsUtils.splitDomainObjectCallback<WsCompany, string>(
      value => `#${value.id}`,
    ), 'company'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsCompany>(
    FunctionsUtils.splitDomainObjectCallback<WsCompany, any[]>(
      company => ['/company', company.id]
    ), 'company'
  ),
  icon: 'fa fa-building',
};

export const CompanyMenuItems: MenuItem[] = [
  MyCompanyMenuItem,
];
