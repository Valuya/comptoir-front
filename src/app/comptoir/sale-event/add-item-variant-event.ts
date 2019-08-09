import {SaleEvent} from './sale-event';
import {SaleEventType} from './sale-event-type';
import {WsItemVariantRef, WsSaleRef} from '@valuya/comptoir-ws-api';

export class AddItemVariantEvent implements SaleEvent {
  type = SaleEventType.ADD_ITEM_VARIANT;
  saleRef: WsSaleRef;
  variantRef: WsItemVariantRef;

  constructor(saleRef: WsSaleRef, variantRef: WsItemVariantRef) {
    this.saleRef = saleRef;
    this.variantRef = variantRef;
  }
}
