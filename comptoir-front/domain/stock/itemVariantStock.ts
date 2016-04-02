/**
 * Created by cghislai on 14/08/15.
 */

import {ItemVariant} from "./../commercial/itemVariant";
import {Stock} from "./stock";
import {WsItemVariantStockRef} from "../../client/domain/stock/itemVariantStock";
import {StockChangeType} from "../../client/domain/util/stockChangeType";
import {WsItemVariantSale} from "../../client/domain/commercial/itemVariantSale";


export interface ItemVariantStock extends Immutable.Map<string, any>  {
    id: number;
    startDateTime: Date;
    endDateTime: Date;
    itemVariant: ItemVariant;
    stock: Stock;
    quantity: number;
    comment: string;
    previousItemStockRef: WsItemVariantStockRef;
    stockChangeType: StockChangeType;
    stockChangeVariantSale: WsItemVariantSale;
    orderPosition: number;
}

var ItemVariantStockRecord = Immutable.Record({
    id: null,
    startDateTime: null,
    endDateTime: null,
    itemVariant: null,
    stock: null,
    quantity: null,
    comment: null,
    previousItemStockRef: null,
    stockChangeType: null,
    stockChangeVariantSale: null,
    orderPosition: null
});

export class ItemVariantStockFactory {

    static createNewItemVariantStock(desc:any):ItemVariantStock {
        return <any>ItemVariantStockRecord(desc);
    }
}
