import {StockVariantIdResolverService} from './stock-variant-id-resolver.service';
import {StockDetailsVariantsRouteComponent} from './stock-details-variants-route/stock-details-variants-route.component';
import {StockListRouteComponent} from './stock-list-route/stock-list-route.component';
import {StockDetailsRouteComponent} from './stock-details-route/stock-details-route.component';
import {StockIdResolverService} from './stock-id-resolver.service';
import {
  ResolvedStockDetailsDetailsMenuItem,
  ResolvedStockDetailsMenuItem,
  ResolvedStockDetailsVariantDetailsMenuItem,
  StockDetailsVariantListMenuItem,
  StockDetailsVariantsMenuItem,
  StockListMenuItem
} from './stock-menu';
import {AppRoute, createAppRouteData} from '../util/app-route-data';
import {StockDetailsFormRouteComponent} from './stock-details-form-route/stock-details-form-route.component';
import {StockDetailsVariantDetailsRouteComponent} from './stock-details-variant-details-route/stock-details-variant-details-route.component';


export const CreateNewStockQuickActionItem = {
  label: 'Create new stock',
  title: 'Create new stock',
  icon: 'fa fa-plus',
  routerLink: ['/stock/new'],
};

export const STOCK_ROUTES: AppRoute[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: StockListRouteComponent,
    data: createAppRouteData(StockListMenuItem, [CreateNewStockQuickActionItem])
  },
  {
    path: ':stockId',
    component: StockDetailsRouteComponent,
    resolve: {
      stock: StockIdResolverService
    },
    data: createAppRouteData(ResolvedStockDetailsMenuItem),
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: StockDetailsFormRouteComponent,
        data: createAppRouteData(ResolvedStockDetailsDetailsMenuItem)
      },
      {
        path: 'variant',
        data: createAppRouteData(StockDetailsVariantsMenuItem),
        children: [
          {
            path: '',
            redirectTo: 'list'
          },
          {
            path: 'list',
            component: StockDetailsVariantsRouteComponent,
            data: createAppRouteData(StockDetailsVariantListMenuItem),
          },
          {
            path: ':variantId',
            component: StockDetailsVariantDetailsRouteComponent,
            resolve: {
              stockVariant: StockVariantIdResolverService,
            },
            data: createAppRouteData(ResolvedStockDetailsVariantDetailsMenuItem),
          }
        ]
      }
    ]
  },
];

