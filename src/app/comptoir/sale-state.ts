import {WsAccountingEntry, WsItemVariantSale, WsSalePriceDetails, WsItemVariantSalePriceDetails, WsSale} from '@valuya/comptoir-ws-api';
import {VariantSaleWithPrice} from '../domain/commercial/item-variant-sale/variant-sale-with-price';

export class SaleState {
  sale: WsSale;
  salePriceDetails: WsSalePriceDetails;
  items: VariantSaleWithPrice[];
  paymentItems: WsAccountingEntry[];

  totalPaid: number;

  lastUpdatedVariantIndex: number;
  lastUpdatedVariant: WsItemVariantSale;
}
