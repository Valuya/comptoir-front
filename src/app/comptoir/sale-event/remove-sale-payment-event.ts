import {SaleEvent} from './sale-event';
import {WsAccountingEntry, WsAccountingEntryRef, WsAccountRef, WsSaleRef} from '@valuya/comptoir-ws-api';
import {SaleEventType} from './sale-event-type';

export class RemoveSalePaymentEvent implements SaleEvent {

  type = SaleEventType.REMOVE_SALE_PAYMENT;
  saleRef: WsSaleRef;
  accountingEntryRef: WsAccountingEntryRef;

  constructor(saleRef: WsSaleRef, accountingEntryRef: WsAccountingEntryRef) {
    this.saleRef = saleRef;
    this.accountingEntryRef = accountingEntryRef;
  }
}
