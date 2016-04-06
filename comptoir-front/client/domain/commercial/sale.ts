/**
 * Created by cghislai on 14/08/15.
 */

import {WsCompanyRef} from "./../company/company";
import {WsCustomerRef} from "./../thirdparty/customer";
import {WsInvoiceRef} from "./invoice";
import {WsAccountingTransactionRef} from "./../accounting/accountingTransaction";
import {WsRef} from "../util/ref";


export class WsSale {
    id:number;
    companyRef:WsCompanyRef;
    customerRef:WsCustomerRef;
    dateTime:Date;
    invoiceRef:WsInvoiceRef;
    vatExclusiveAmount:number;
    vatAmount:number;
    closed:boolean;
    reference:string;
    accountingTransactionRef:WsAccountingTransactionRef;
    discountRatio:number;
    discountAmount:number;
}

export class WsSaleRef extends WsRef<WsSale> {
}


export class WsSaleFactory {
    static fromJSONReviver = (key, value)=> {
        switch (key) {
            case 'dateTime':
                return new Date(value);
        }
        return value;
    }

    static toJSONReplacer = (key, value)=> {
        switch (key) {
            case 'dateTime':
                return value;
        }
        return value;
    }


}