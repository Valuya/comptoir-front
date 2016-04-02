/**
 * Created by cghislai on 01/09/15.
 */


import {Company} from "./../company/company";
import {Customer} from "./../thirdparty/customer";
import * as Immutable from "immutable";
import {WsInvoiceRef} from "../../client/domain/commercial/invoice";
import {WsAccountingTransactionRef} from "../../client/domain/accounting/accountingTransaction";

export interface Sale extends Immutable.Map<string, any> {
    id:number;
    company:Company;
    customer:Customer;
    dateTime:Date;
    invoiceRef:WsInvoiceRef; // Keep ref to avoid cyclic dependencies
    vatExclusiveAmount:number;
    vatAmount:number;
    closed:boolean;
    reference:string;
    // FIXME: implement service in backend
    accountingTransactionRef:WsAccountingTransactionRef;
    discountRatio:number;
    discountAmount:number;

    totalPaid:number;
}
var SaleRecord = Immutable.Record({
    id: null,
    company: null,
    customer: null,
    dateTime: null,
    invoice: null,
    vatExclusiveAmount: null,
    vatAmount: null,
    closed: null,
    reference: null,
    accountingTransactionRef: null,
    discountRatio: null,
    discountAmount: null
});

export class SaleFactory {

    static createNewSale(desc:any):Sale {
        return <any>SaleRecord(desc);
    }

}