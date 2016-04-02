/**
 * Created by cghislai on 14/08/15.
 */

import {WsCompanyRef} from "./../company/company";
import {AccountingTransactionType} from "../util/accountingTransactionType";
import {WsRef} from "../util/ref";

export class WsAccountingTransaction {
    id:number;
    companyRef:WsCompanyRef;
    dateTime:Date;
    accountingTransactionType:AccountingTransactionType;
}

export class WsAccountingTransactionRef extends WsRef<WsAccountingTransaction> {
}

export class WsAccountingTransactionFactory {
    static fromJSONReviver = (key, value)=>{
        switch (key) {
            case 'accountingTransactionType':
                return AccountingTransactionType[value];
            case 'dateTime':
                return new Date(value);
        }
        return value;
    }
}