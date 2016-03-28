/**
 * Created by cghislai on 08/09/15.
 */

import {LocalItemVariant} from './itemVariant';
import {LocalSale} from './sale';

import {LocaleTexts} from '../utils/lang';

import * as Immutable from 'immutable';
import {LocalStock} from "./stock";

export interface LocalItemVariantSale extends Immutable.Map<string, any> {
    id:number;
    dateTime:Date;
    quantity:number;
    comment:LocaleTexts;
    vatExclusive:number;
    vatRate:number;
    discountRatio:number;
    total:number;
    itemVariant:LocalItemVariant;
    sale:LocalSale;
    stock: LocalStock;
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

export class LocalItemVariantSaleFactory {

    static createNewItemVariantSale(desc:any):LocalItemVariantSale {
        return <any>ItemVariantSaleRecord(desc);
    }
}