/**
 * Created by cghislai on 02/09/15.
 */

import {Account} from "./account";
import {Company} from "./../company/company";
import * as Immutable from "immutable";
import {LocaleTexts} from "../../client/utils/lang";
import {WsAccountingEntryRef} from "../../client/domain/accounting/accountingEntry";
import {WsCustomer} from "../../client/domain/thirdparty/customer";

export interface AccountingEntry extends Immutable.Map<string, any> {
    id:number;
    company:Company;
    amount:number;
    vatRate:number;
    dateTime:Date;
    description:LocaleTexts;
    accountingTransactionRef:WsAccountingEntryRef;
    vatAccountingEntry:AccountingEntry;
    customer:WsCustomer;

    account:Account;
}
var AccountingEntryRecord = Immutable.Record({
    id: null,
    company: null,
    amount: null,
    vatRate: null,
    dateTime: null,
    description: null,
    accountingTransactionRef: null,
    vatAccountingEntry: null,
    customer: null,
    account: null
});

export class AccountingEntryFactory {

    static createAccountingEntry(desc:any) {
        return <any>AccountingEntryRecord(desc);
    }

}