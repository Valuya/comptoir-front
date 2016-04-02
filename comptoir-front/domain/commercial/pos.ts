/**
 * Created by cghislai on 01/09/15.
 */


import {Company} from "./../company/company";
import {Customer} from "./../thirdparty/customer";
import * as Immutable from "immutable";
import {LocaleTexts} from "../../client/utils/lang";

export interface Pos extends Immutable.Map<string, any> {
    id:number;
    company:Company;
    name:string;
    description:LocaleTexts;
    defaultCustomer:Customer;
}
var PosRecord = Immutable.Record({
    id: null,
    company: null,
    name: null,
    description: null,
    defaultCustomer: null
});

export class PosFactory {

    static createNewPos(desc:any):Pos {
        return <any>PosRecord(desc);
    }
}