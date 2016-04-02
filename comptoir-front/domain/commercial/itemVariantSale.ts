/**
 * Created by cghislai on 08/09/15.
 */

import {ItemVariant} from "./itemVariant";
import {Sale} from "./sale";
import * as Immutable from "immutable";
import {Stock} from "./../stock/stock";
import {LocaleTexts} from "../../client/utils/lang";

export interface ItemVariantSale extends Immutable.Map<string, any> {
    id:number;
    dateTime:Date;
    quantity:number;
    comment:LocaleTexts;
    vatExclusive:number;
    vatRate:number;
    discountRatio:number;
    total:number;
    itemVariant:ItemVariant;
    sale:Sale;
    stock: Stock;
    includeCustomerLoyalty: boolean;
}
var ItemVariantSaleRecord = Immutable.Record({
    id: null,
    dateTime: null,
    quantity: null,
    comment: null,
    vatExclusive: null,
    vatRate: null,
    discountRatio: null,
    total: null,
    itemVariant: null,
    sale: null,
    stock: null,
    includeCustomerLoyalty: null
});

export class ItemVariantSaleFactory {

    static createNewItemVariantSale(desc:any):ItemVariantSale {
        return <any>ItemVariantSaleRecord(desc);
    }
}