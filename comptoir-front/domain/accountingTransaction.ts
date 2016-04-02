/**
 * Created by cghislai on 02/09/15.
 */

import {LocalCompany} from "./company";
import * as Immutable from "immutable";
import {AccountingTransactionType} from "../client/domain/util/accountingTransactionType";

export interface LocalAccountingTransaction extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    dateTime:Date;
    accountingTransactionType:AccountingTransactionType;
}
var AccountingtTansactionRecord = Immutable.Record({
    id: null,
    company: null,
    dateTime: null,
    accountingTransactionType: null
});

export class LocalAccountingTransactionFactory {

    static createAccountingTransaction(desc:any) {
        return <any>AccountingtTansactionRecord(desc);
    }
}