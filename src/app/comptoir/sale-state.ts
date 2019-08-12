import {WsAccountingEntry, WsItemVariantSale, WsSale} from '@valuya/comptoir-ws-api';

export class SaleState {
  sale: WsSale;
  items: WsItemVariantSale[];
  paymentItems: WsAccountingEntry[];

  totalPaid: number;

  lastUpdatedVariantIndex: number;
  lastUpdatedVariant: WsItemVariantSale;
}
