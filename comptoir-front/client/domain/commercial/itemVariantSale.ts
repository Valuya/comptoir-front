/**
 * Created by cghislai on 14/08/15.
 */

import {WsItemVariantRef} from "./itemVariant";
import {WsSaleRef} from "./sale";
import {LocaleTexts, LocaleTextsFactory} from "../../utils/lang";
import {WsStockRef} from "./../stock/stock";
import {WsRef} from "../util/ref";


export class WsItemVariantSale {
    id: number;
    dateTime: Date;
    itemVariantRef: WsItemVariantRef;
    quantity: number;
    saleRef: WsSaleRef;
    comment: LocaleTexts;
    vatExclusive: number;
    vatRate: number;
    discountRatio: number;
    total: number;
    stockRef: WsStockRef;
    includeCustomerLoyalty: boolean;
}

export class WsItemVariantSaleRef extends WsRef<WsItemVariantSale>{
}


export class WsItemVariantSaleFactory {
    static fromJSONReviver = (key, value)=>{
        switch (key) {
            case 'dateTime':
                return new Date(value);
            case 'comment':
                return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }
    static toJSONReplacer = (key, value)=>{
        switch (key) {
            case 'dateTime':
                return value;
            case 'comment':
                return LocaleTextsFactory.toJSONArrayLocaleTextsTransformer(value);
        }
        return value;
    }

}