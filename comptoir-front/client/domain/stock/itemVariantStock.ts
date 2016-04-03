/**
 * Created by cghislai on 14/08/15.
 */

import {WsItemVariantRef} from "./../commercial/itemVariant";
import {WsItemVariantSaleRef} from "./../commercial/itemVariantSale";
import {WsStockRef} from "./stock";
import {StockChangeType} from "../util/stockChangeType";
import {WsRef} from "../util/ref";


export class WsItemVariantStock {
    id: number;
    startDateTime: Date;
    endDateTime: Date;
    itemVariantRef: WsItemVariantRef;
    stockRef: WsStockRef;
    quantity: number;
    comment: string;
    previousItemStockRef: WsItemVariantStockRef;
    stockChangeType: StockChangeType;
    stockChangeVariantSaleRef: WsItemVariantSaleRef;
    orderPosition: number;
}


export class WsItemVariantStockRef extends WsRef<WsItemVariantStock>{
}

export class WsItemVariantStockFactory {
    static fromJSONReviver = (key, value)=>{
        switch (key) {
            case 'stockChangeType':
                return StockChangeType[value];
            case 'startDateTime':
            case 'endDateTime':
                return new Date(value);
        }
        return value;
    }

    static toJSONReplacer = (key, value)=>{
        switch (key) {
            case 'stockChangeType':
                return StockChangeType[value];
            case 'startDateTime':
            case 'endDateTime':
                return value;
        }
        return value;
    }

}