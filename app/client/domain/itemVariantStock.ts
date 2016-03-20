/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from "./company";
import {ItemVariantRef} from "./itemVariant";
import {SaleRef} from "./sale";
import {LocaleTexts, LocaleTextsFactory} from "../utils/lang";
import {StockRef} from "./stock";


export class ItemVariantStock {
    id: number;
    startDateTime: Date;
    endDateTime: Date;
    itemVariantRef: ItemVariantRef;
    stockRef: StockRef;
    quantity: number;
    comment: string;
    previousItemStockRef: ItemVariantStockRef;
    stockChangeType: StockChangeType;
    stockChangeSaleRef: SaleRef;
}

export enum StockChangeType {
    INITIAL,
    SALE,
    TRANSFER,
    ADJUSTMENT
}

export class ItemVariantStockRef {
    id: number;
    link: string;
}

export class ItemVariantStockSearch {
    companyRef: CompanyRef;
    itemVariantRef: ItemVariantRef;
    stockRef: StockRef;
    atDateTime: Date;
}

export class ItemVariantStockFactory {
    static fromJSONReviver = (key, value)=>{
        if (key ==='stockChangeSaleRef') {
            return StockChangeType[value];
        }
        return value;
    }

}