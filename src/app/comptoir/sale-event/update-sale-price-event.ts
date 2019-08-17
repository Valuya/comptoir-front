import {WsSalePriceDetails, WsSaleRef} from '@valuya/comptoir-ws-api';
import {SaleEvent} from './sale-event';
import {SaleEventType} from './sale-event-type';

export class UpdateSalePriceEvent<K extends keyof WsSalePriceDetails> implements SaleEvent {
  type = SaleEventType.UPDATE_SALE_PRICE;
  saleRef: WsSaleRef;
  property: K;
  value: number;

  constructor(saleRef: WsSaleRef, property: K, value: number) {
    this.saleRef = saleRef;
    this.property = property;
    this.value = value;
  }
}
