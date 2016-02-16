/**
 * Created by cghislai on 14/08/15.
 */


export class SalePrice {
    base:number;
    taxes:number;
}

export class SalePriceFactory {
    static fromJSONReviver = (key, value)=> {
        return value;
    }


}