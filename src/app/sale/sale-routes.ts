import {SaleVariantIdResolverService} from './sale-variant-id-resolver.service';
import {SaleDetailsFormRouteComponent} from './sale-details-form-route/sale-details-form-route.component';
import {SaleDetailsVariantsRouteComponent} from './sale-details-variants-route/sale-details-variants-route.component';
import {Routes} from '@angular/router';
import {SaleListRouteComponent} from './sale-list-route/sale-list-route.component';
import {SaleDetailsRouteComponent} from './sale-details-route/sale-details-route.component';
import {SaleIdResolverService} from './sale-id-resolver.service';
import {
  ResolvedSaleDetailsDetailsMenuItem,
  SaleDetailsVariantListMenuItem,
  SaleDetailsVariantsMenuItem,
  SaleListMenuItem,
  ResolvedSaleDetailsMenuItem,
  ResolvedSaleDetailsVariantDetailsMenuItem
} from './sale-menu';
import {SaleDetailsVariantDetailsRouteComponent} from './sale-details-variant-details-route/sale-details-variant-details-route.component';
import {createAppRouteData} from '../util/app-route-data';


export const SALE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: SaleListRouteComponent,
    data: createAppRouteData(SaleListMenuItem)
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
        component: SaleDetailsFormRouteComponent,
        data: createAppRouteData(ResolvedSaleDetailsDetailsMenuItem)
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

