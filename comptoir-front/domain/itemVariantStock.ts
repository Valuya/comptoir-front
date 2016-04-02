/**
 * Created by cghislai on 14/08/15.
 */

import {LocalItemVariant} from "./itemVariant";
import {LocalStock} from "./stock";
import {WsItemVariantStockRef} from "../client/domain/stock/itemVariantStock";
import {StockChangeType} from "../client/domain/util/stockChangeType";
import {WsItemVariantSale} from "../client/domain/commercial/itemVariantSale";


export interface LocalItemVariantStock extends Immutable.Map<string, any>  {
    id: number;
    startDateTime: Date;
    endDateTime: Date;
    itemVariant: LocalItemVariant;
    stock: LocalStock;
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

export class LocalItemVariantStockFactory {

    static createNewItemVariantStock(desc:any):LocalItemVariantStock {
        return <any>ItemVariantStockRecord(desc);
    }
}
