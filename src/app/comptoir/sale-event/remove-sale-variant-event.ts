import {SaleEvent} from './sale-event';
import {SaleEventType} from './sale-event-type';
import {WsItemVariantSaleRef, WsSaleRef} from '@valuya/comptoir-ws-api';

export class RemoveSaleVariantEvent implements SaleEvent {
  type = SaleEventType.REMOVE_SALE_VARIANT;
  saleRef: WsSaleRef;
  saleVariantRef: WsItemVariantSaleRef;


  constructor(saleRef: WsSaleRef, saleVariantRef: WsItemVariantSaleRef) {
    this.saleRef = saleRef;
    this.saleVariantRef = saleVariantRef;
  }
}
