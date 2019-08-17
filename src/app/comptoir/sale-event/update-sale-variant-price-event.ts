import {WsItemVariantSalePriceDetails, WsItemVariantSaleRef, WsSaleRef} from '@valuya/comptoir-ws-api';
import {SaleEvent} from './sale-event';
import {SaleEventType} from './sale-event-type';

export class UpdateSaleVariantPriceEvent<K extends keyof WsItemVariantSalePriceDetails> implements SaleEvent {
  type = SaleEventType.UPDATE_SALE_VARIANT_PRICE;
  saleRef: WsSaleRef;
  variantRef: WsItemVariantSaleRef;
  property: K;
  value: number;

  constructor(saleRef: WsSaleRef, variantRef: WsItemVariantSaleRef, property: K, value: number) {
    this.saleRef = saleRef;
    this.variantRef = variantRef;
    this.property = property;
    this.value = value;
  }
}
