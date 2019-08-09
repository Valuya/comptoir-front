import {SaleEvent} from './sale-event';
import {WsAccountingEntry, WsSaleRef} from '@valuya/comptoir-ws-api';
import {SaleEventType} from './sale-event-type';

export class AddSalePaymentEvent implements SaleEvent {
  type= SaleEventType.ADD_SALE_PAYMENT;
  saleRef: WsSaleRef;
  entry: WsAccountingEntry;


  constructor(saleRef: WsSaleRef, entry: WsAccountingEntry) {
    this.saleRef = saleRef;
    this.entry = entry;
  }
}
