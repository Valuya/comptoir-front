import {WsItemVariantSale, WsItemVariantSaleRef} from '@valuya/comptoir-ws-api';

export interface SaleVariantUpdate {
  variantRef: WsItemVariantSaleRef;
  update: Partial<WsItemVariantSale>;
}
