/**
 * Created by cghislai on 01/09/15.
 */


import {Company} from "./../company/company";
import * as Immutable from "immutable";
import {LocaleTexts} from "../../client/utils/lang";

export interface Stock extends Immutable.Map<string, any> {
    id:number;
    company:Company;
    description: LocaleTexts;
    active:boolean;
}
var StockRecord = Immutable.Record({
    id: null,
    company: null,
    description: null,
    active: null
});

export class StockFactory {

    static createNewStock(desc:any):Stock {
        return <any>StockRecord(desc);
    }

}