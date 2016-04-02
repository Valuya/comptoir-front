/**
 * Created by cghislai on 02/09/15.
 */

import {LocalAccount} from "./account";
import {LocalCompany} from "./company";
import * as Immutable from "immutable";
import {LocaleTexts} from "../client/utils/lang";
import {WsAccountingEntryRef} from "../client/domain/accounting/accountingEntry";
import {WsCustomer} from "../client/domain/thirdparty/customer";

export interface LocalAccountingEntry extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    amount:number;
    vatRate:number;
    dateTime:Date;
    description:LocaleTexts;
    accountingTransactionRef:WsAccountingEntryRef;
    vatAccountingEntry:LocalAccountingEntry;
    customer:WsCustomer;

    account:LocalAccount;
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

export class LocalAccountingEntryFactory {

    static createAccountingEntry(desc:any) {
        return <any>AccountingEntryRecord(desc);
    }

}