/**
 * Created by cghislai on 02/09/15.
 */

import {Company} from "./../company/company";
import * as Immutable from "immutable";
import {AccountingTransactionType} from "../../client/domain/util/accountingTransactionType";

export interface AccountingTransaction extends Immutable.Map<string, any> {
    id:number;
    company:Company;
    dateTime:Date;
    accountingTransactionType:AccountingTransactionType;
}
var AccountingtTansactionRecord = Immutable.Record({
    id: null,
    company: null,
    dateTime: null,
    accountingTransactionType: null
});

export class AccountingTransactionFactory {

    static createAccountingTransaction(desc:any) {
        return <any>AccountingtTansactionRecord(desc);
    }
}