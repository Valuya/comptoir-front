import {WsItemVariantSale, WsItemVariantSaleRef} from '@valuya/comptoir-ws-api';
import {WsItemVariantSalePriceDetails} from '@valuya/comptoir-ws-api/dist/models/WsItemVariantSalePriceDetails';

export interface ItemWithPrice {
  itemRef: WsItemVariantSaleRef;
  item: WsItemVariantSale;
  price: WsItemVariantSalePriceDetails;
}
