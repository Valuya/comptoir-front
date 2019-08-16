import {WsAccountingEntry, WsItemVariantSale, WsSalePriceDetails, WsItemVariantSalePriceDetails, WsSale} from '@valuya/comptoir-ws-api';

export class SaleState {
  sale: WsSale;
  salePriceDetails: WsSalePriceDetails;
  items: WsItemVariantSale[];
  itemPrices: WsItemVariantSalePriceDetails[];
  paymentItems: WsAccountingEntry[];

  totalPaid: number;

  lastUpdatedVariantIndex: number;
  lastUpdatedVariant: WsItemVariantSale;
}
