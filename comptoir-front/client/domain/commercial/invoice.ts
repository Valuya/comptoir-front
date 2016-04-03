/**
 * Created by cghislai on 14/08/15.
 */

import {WsCompanyRef} from "./../company/company";
import {WsSaleRef} from "./sale";
import {WsRef} from "../util/ref";

export class WsInvoice {
    id: number;
    companyRef: WsCompanyRef;
    number: string;
    note: string;
    saleRef: WsSaleRef;
}

export class WsInvoiceRef extends WsRef<WsInvoice> {
}


export class WsInvoiceFactory {
    static fromJSONReviver = (key, value)=>{
        return value;
    }
    static toJSONReplacer = (key, value)=>{
        return value;
    }

}