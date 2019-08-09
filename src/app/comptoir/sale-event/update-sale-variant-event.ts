import {SaleEvent} from './sale-event';
import {SaleEventType} from './sale-event-type';
import {WsItemVariantSale, WsItemVariantSaleRef, WsSaleRef} from '@valuya/comptoir-ws-api';

export class UpdateSaleVariantEvent<K extends keyof WsItemVariantSale> implements SaleEvent {
  type = SaleEventType.UPDATE_SALE_VARIANT;
  saleRef: WsSaleRef;
  variantRef: WsItemVariantSaleRef;
  update: Partial<WsItemVariantSale>;


  constructor(saleRef: WsSaleRef, variantRef: WsItemVariantSaleRef, update: Partial<WsItemVariantSale>) {
    this.saleRef = saleRef;
    this.variantRef = variantRef;
    this.update = update;
  }
}
