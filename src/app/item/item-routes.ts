import {ItemVariantIdResolverService} from './item-variant-id-resolver.service';
import {ItemDetailFormRouteComponent} from './item-detail-form-route/item-detail-form-route.component';
import {ItemDetailVariantsRouteComponent} from './item-detail-variants-route/item-detail-variants-route.component';
import {Routes} from '@angular/router';
import {ItemListRouteComponent} from './item-list-route/item-list-route.component';
import {ItemDetailsRouteComponent} from './item-details-route/item-details-route.component';
import {ItemIdResolverService} from './item-id-resolver.service';
import {
  CreateNewItemQuickActionItem,
  ItemDetailsDetailsMenuItem,
  ItemDetailsVariantListMenuItem,
  ItemDetailsVariantsMenuItem,
  ItemListMenuItem,
  ResolvedItemDetailsMenuItem,
  ResolvedItemDetailsVariantDetailsMenuItem
} from './item-menu';
import {ItemDetailVariantDetailRouteComponent} from './item-detail-variant-detail-route/item-detail-variant-detail-route.component';
import {createAppRouteData} from '../util/app-route-data';


export const ITEM_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: ItemListRouteComponent,
    data: createAppRouteData(ItemListMenuItem, [CreateNewItemQuickActionItem])
  },
  {
    path: ':itemId',
    component: ItemDetailsRouteComponent,
    resolve: {
      item: ItemIdResolverService
    },
    data: createAppRouteData(ResolvedItemDetailsMenuItem),
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ItemDetailFormRouteComponent,
        data: createAppRouteData(ItemDetailsDetailsMenuItem)
      },
      {
        path: 'variant',
        data: createAppRouteData(ItemDetailsVariantsMenuItem),
        children: [
          {
            path: '',
            redirectTo: 'list'
          },
          {
            path: 'list',
            component: ItemDetailVariantsRouteComponent,
            data: createAppRouteData(ItemDetailsVariantListMenuItem),
          },
          {
            path: ':variantId',
            component: ItemDetailVariantDetailRouteComponent,
            resolve: {
              itemVariant: ItemVariantIdResolverService,
            },
            data: createAppRouteData(ResolvedItemDetailsVariantDetailsMenuItem),
          }
        ]
      }
    ]
  },
];

