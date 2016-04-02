/**
 * Created by cghislai on 01/09/15.
 */


import * as Immutable from "immutable";

export interface LocalSalePrice extends Immutable.Map<string, any> {
   base: number;
    taxes: number;
}
var SalePriceRecord = Immutable.Record({
    base: null,
    taxes: null
});

export class LocalSalePriceFactory {

    static createNewSalePrice(desc:any):LocalSalePrice {
        return <any>SalePriceRecord(desc);
    }

}