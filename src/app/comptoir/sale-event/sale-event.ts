import {WsSaleRef} from '@valuya/comptoir-ws-api';
import {SaleEventType} from './sale-event-type';

export interface SaleEvent {
  type: SaleEventType;
  saleRef: WsSaleRef;
}
