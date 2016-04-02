/**
 * Created by cghislai on 01/09/15.
 */


import * as Immutable from "immutable";

export interface SalePrice extends Immutable.Map<string, any> {
   base: number;
    taxes: number;
}
var SalePriceRecord = Immutable.Record({
    base: null,
    taxes: null
});

export class SalePriceFactory {

    static createNewSalePrice(desc:any):SalePrice {
        return <any>SalePriceRecord(desc);
    }

}