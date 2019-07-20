import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ItemListRouteComponent} from '../item/item-list-route/item-list-route.component';
import {AppRouteData} from '../app-routes';
import {ItemDetailsRouteComponent} from '../item/item-details-route/item-details-route.component';
import {ItemIdResolverService} from '../item/item-id-resolver.service';
import {ItemVariantListRouteComponent} from './item-variant-list-route/item-variant-list-route.component';
import {ItemVariantDetailsRouteComponent} from './item-variant-details-route/item-variant-details-route.component';
import {ItemVariantIdResolverService} from './item-variant-id-resolver.service';


const ITEM_VARIANT_ROUTES = [
  {
    path: '',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: ItemVariantListRouteComponent,
    data: {
      menuItem: {
        label: 'List',
        title: 'List',
        icon: 'fa fa-list',
        routerLink: ['/item/list'],
      }
    }
  },
  {
    path: ':variantId',
    component: ItemVariantDetailsRouteComponent,
    resolve: {
      itemVariant: ItemVariantIdResolverService,
    },
    data: {
      menuItem: {
        label: 'List',
        title: 'List',
        icon: 'fa fa-square-o',
      }
    }
  }
];
export const ITEM_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list'
  },
  {
    path: 'list',
    component: ItemListRouteComponent,
    data: {
      menuItem: {
        label: 'List',
        title: 'List',
        icon: 'fa fa-list',
        routerLink: ['/item/list'],
      }
    } as AppRouteData
  },
  {
    path: 'variant',
    children: ITEM_VARIANT_ROUTES,
    data: {
      menuItem: {
        label: 'Variants',
        title: 'Variants',
        icon: 'fa fa-square-o',
        routerLink: ['/item/variant/list'],
      }
    } as AppRouteData
  },
  {
    path: ':itemId',
    component: ItemDetailsRouteComponent,
    resolve: {
      item: ItemIdResolverService
    },
    data: {
      menuItem: {
        label: 'Details',
        title: 'Details',
        icon: 'fa fa-square',
      }
    },
    children: [
      {
        path: 'variant',
        children: ITEM_VARIANT_ROUTES,
        data: {
          menuItem: {
            label: 'Variants',
            title: 'Variants',
            icon: 'fa fa-list',
            routerLink: ['/item/variant/list'],
          }
        } as AppRouteData
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(ITEM_ROUTES)],
  exports: [RouterModule]
})
export class ItemRoutingModule {
}
