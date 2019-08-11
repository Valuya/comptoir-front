import {SaleVariantIdResolverService} from './sale-variant-id-resolver.service';
import {SaleDetailsFormRouteComponent} from './sale-details-form-route/sale-details-form-route.component';
import {SaleDetailsVariantsRouteComponent} from './sale-details-variants-route/sale-details-variants-route.component';
import {SaleListRouteComponent} from './sale-list-route/sale-list-route.component';
import {SaleDetailsRouteComponent} from './sale-details-route/sale-details-route.component';
import {SaleIdResolverService} from './sale-id-resolver.service';
import {
  PrintMenuItem,
  ResolvedSaleDetailsBillMenuItem,
  ResolvedSaleDetailsDetailsMenuItem,
  ResolvedSaleDetailsMenuItem,
  ResolvedSaleDetailsVariantDetailsMenuItem,
  SaleDetailsVariantListMenuItem,
  SaleDetailsVariantsMenuItem, SaleListMenuItem
} from './sale-menu';
import {SaleDetailsVariantDetailsRouteComponent} from './sale-details-variant-details-route/sale-details-variant-details-route.component';
import {AppRoute, createAppRouteData} from '../util/app-route-data';
import {SalePrintRouteComponent} from './sale-print-route/sale-print-route.component';
import {SaleSearchFilterResolverService} from './sale-search-filter-resolver.service';


export const SALE_ROUTES: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: SaleListRouteComponent,
    data: {
      menuItem: SaleListMenuItem,
    },
    resolve: {
      saleSearchFilter: SaleSearchFilterResolverService
    },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {
    path: ':saleId',
    component: SaleDetailsRouteComponent,
    resolve: {
      sale: SaleIdResolverService
    },
    data: createAppRouteData(ResolvedSaleDetailsMenuItem),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'details'
      },
      {
        path: 'details',
        component: SaleDetailsFormRouteComponent,
        data: createAppRouteData(ResolvedSaleDetailsDetailsMenuItem)
      },
      {
        path: 'bill',
        component: SalePrintRouteComponent,
        data: createAppRouteData(ResolvedSaleDetailsBillMenuItem, [PrintMenuItem])
      },
      {
        path: 'variant',
        data: createAppRouteData(SaleDetailsVariantsMenuItem),
        children: [
          {
            path: '',
            redirectTo: 'list'
          },
          {
            path: 'list',
            component: SaleDetailsVariantsRouteComponent,
            data: createAppRouteData(SaleDetailsVariantListMenuItem),
          },
          {
            path: ':variantId',
            component: SaleDetailsVariantDetailsRouteComponent,
            resolve: {
              saleVariant: SaleVariantIdResolverService,
            },
            data: createAppRouteData(ResolvedSaleDetailsVariantDetailsMenuItem),
          }
        ]
      }
    ]
  },
];

