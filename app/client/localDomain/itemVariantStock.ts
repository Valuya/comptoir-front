/**
 * Created by cghislai on 14/08/15.
 */

import {LocalItemVariant} from "./itemVariant";
import {SaleRef} from "../domain/sale";
import {LocalStock} from "./stock";
import {StockChangeType, ItemVariantStockRef} from "../domain/itemVariantStock";


export interface LocalItemVariantStock extends Immutable.Map<string, any>  {
    id: number;
    startDateTime: Date;
    endDateTime: Date;
    itemVariant: LocalItemVariant;
    stock: LocalStock;
    quantity: number;
    comment: string;
    previousItemStockRef: ItemVariantStockRef;
    stockChangeType: StockChangeType;
    stockChangeSaleRef: SaleRef;
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
    stockChangeSaleRef: null
});

export class LocalItemVariantStockFactory {

    static createNewItemVariantStock(desc:any):LocalItemVariantStock {
        return <any>ItemVariantStockRecord(desc);
    }
}
