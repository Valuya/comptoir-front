import {WsSale, WsSalePriceDetails} from '@valuya/comptoir-ws-api';

export interface SaleWithPrice {
  sale: WsSale;
  price: WsSalePriceDetails;
}
