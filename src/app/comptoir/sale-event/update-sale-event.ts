import {SaleEvent} from './sale-event';
import {SaleEventType} from './sale-event-type';
import {WsSale, WsSaleRef} from '@valuya/comptoir-ws-api';


export class UpdateSaleEvent<K extends keyof WsSale> implements SaleEvent {
  type = SaleEventType.UPDATE_SALE;
  saleRef: WsSaleRef;
  update: Partial<WsSale>;


  constructor(saleRef: WsSaleRef, update: Partial<WsSale>) {
    this.saleRef = saleRef;
    this.update = update;
  }
}
