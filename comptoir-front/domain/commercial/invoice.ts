/**
 * Created by cghislai on 08/09/15.
 */

import {Company} from "./../company/company";
import {Sale} from "./sale";
import * as Immutable from "immutable";

export interface Invoice extends Immutable.Map<string, any> {
    id: number;
    company: Company;
    number: string;
    note: string;
    sale: Sale;
}
var InvoiceRecord = Immutable.Record({
    id: null,
    company: null,
    number: null,
    note: null,
    sale: null
});
export class InvoiceFactory {

    static createNewInvoice(desc:any):Invoice {
        return <any>InvoiceRecord(desc);
    }
}