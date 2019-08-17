import {WsItemVariantSale, WsItemVariantSalePriceDetails} from '@valuya/comptoir-ws-api';

export interface VariantSaleWithPrice {
  variantSale: WsItemVariantSale;
  price: WsItemVariantSalePriceDetails;
}
