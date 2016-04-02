/**
 * Created by cghislai on 14/08/15.
 */

import {WsCompanyRef} from "./../company/company";
import {WsAccountRef} from "./account";
import {WsAccountingTransactionRef} from "./accountingTransaction";
import {WsCustomerRef} from "./../thirdparty/customer";
import {LocaleTexts, LocaleTextsFactory} from "../../utils/lang";
import {WsRef} from "../util/ref";

export class WsAccountingEntry {
    id: number;
    companyRef: WsCompanyRef;
    accountRef: WsAccountRef;
    amount: number = 0;
    vatRate: number = 0;
    dateTime: Date;
    description: LocaleTexts;
    accountingTransactionRef: WsAccountingTransactionRef;
    vatAccountingEntryRef: WsAccountingEntryRef;
    customerRef: WsCustomerRef;
}

export class WsAccountingEntryRef extends WsRef<WsAccountingEntry> {
}



export class WsAccountingEntryFactory {
    static fromJSONReviver = (key, value)=>{
        switch (key) {
            case 'description':
                return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
            case 'dateTime':
                return new Date(value);
        }
        return value;
    }
}