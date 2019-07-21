import {MenuItem} from 'primeng/api';
import {WsItem, WsItemVariant} from '@valuya/comptoir-ws-api';
import {ResolvedRouteItem} from '../util/resolved-route-item';
import {FunctionsUtils} from '../util/functions-utils';
import {RouteUtils} from '../util/route-utils';


export const CreateNewItemQuickActionItem = {
  label: 'Create new item',
  title: 'Create new item',
  icon: 'fa fa-plus',
  routerLink: ['/item/new'],
};
export const ItemDetailsVariantListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsItem>(
    FunctionsUtils.splitDomainObjectCallback<WsItem, any[]>(
      item => ['/item', item.id, 'variant', 'list']
    ), 'item'
  ),
};

export const ResolvedItemDetailsVariantDetailsMenuItem: MenuItem & ResolvedRouteItem<WsItem> = {
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsItemVariant>(
    FunctionsUtils.splitDomainObjectCallback<WsItemVariant, string>(
      value => `${value.variantReference}`,
      value => `New variant`,
    ), 'variant'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsItem, WsItemVariant>(
    (item, variant) => (item == null || variant == null) ? [] : ['/item', item.id, 'variant', variant.id],
    'item', 'itemVariant'
  ),
  icon: 'fa fa-square',
};

const ItemDetailVariantMenuItems: MenuItem[] = [
  ItemDetailsVariantListMenuItem,
  ResolvedItemDetailsVariantDetailsMenuItem
];

export const ItemDetailsDetailsMenuItem: MenuItem & ResolvedRouteItem<WsItem> = {
  label: 'Details',
  title: 'Details',
  icon: 'fa fa-square',
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsItem>(
    FunctionsUtils.splitDomainObjectCallback<WsItem, any[]>(
      item => ['/item', item.id]
    ), 'item'
  ),
};

export const ItemDetailsVariantsMenuItem: MenuItem & ResolvedRouteItem<WsItem> = {
  label: 'Variants',
  title: 'Variants',
  icon: 'fa fa-square-o',
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsItem>(
    FunctionsUtils.splitDomainObjectCallback<WsItem, any[]>(
      item => ['/item', item.id, 'variant', 'list']
    ), 'item'
  ),
  items: ItemDetailVariantMenuItems
};
export const ItemDetailMenuItems: MenuItem[] = [
  ItemDetailsDetailsMenuItem,
  ItemDetailsVariantsMenuItem
];

export const ItemListMenuItem = {
  label: 'List',
  title: 'List',
  icon: 'fa fa-list',
  routerLink: ['/item/list'],
};

export const ResolvedItemDetailsMenuItem: MenuItem & ResolvedRouteItem<WsItem> = {
  labelFactory: RouteUtils.createLabelFactoryFromRouteDataEntities<WsItem>(
    FunctionsUtils.splitDomainObjectCallback<WsItem, string>(
      value => `${value.reference}`,
      value => `New item`,
    ), 'item'
  ),
  routerLinkFactory: RouteUtils.createRouterLinkFactoryFromRouteDataEntities<WsItem>(
    FunctionsUtils.splitDomainObjectCallback<WsItem, any[]>(
      item => ['/item', item.id]
    ), 'item'
  ),
  icon: 'fa fa-square',
  items: ItemDetailMenuItems
};

export const ItemMenuItems: MenuItem[] = [
  ItemListMenuItem,
  ResolvedItemDetailsMenuItem
];
