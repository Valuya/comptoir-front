/**
 * Created by cghislai on 02/09/15.
 */

import {Company} from "./../company/company";
import * as Immutable from "immutable";
import {LocaleTexts, LocaleTextsFactory} from "../../client/utils/lang";
import {AccountType} from "../../client/domain/util/accountType";

export interface Account extends Immutable.Map<string, any> {
    id:number;
    company:Company;
    accountingNumber:string;
    iban:string;
    bic:string;
    name:string;
    description:LocaleTexts;
    accountType:AccountType;
    accountTypeLabel:LocaleTexts;
    cash: boolean;
}

var AccountRecord = Immutable.Record({
    id: null,
    company: null,
    accountingNumber: null,
    iban: null,
    bic: null,
    name: null,
    description: null,
    accountType: null,
    accountTypeLabel: null,
    cash: null
});

export class AccountFactory {


    static ACCOUNT_TYPE_OTHER_LABEL = LocaleTextsFactory.toLocaleTexts({
        'fr': 'Autre'
    });
    static ACCOUNT_TYPE_VAT_LABEL = LocaleTextsFactory.toLocaleTexts({
        'fr': 'TVA'
    });
    static ACCOUNT_TYPE_PAIMENT_LABEL = LocaleTextsFactory.toLocaleTexts({
        'fr': 'Paiment'
    });

    static getAccountTypeLabel(accountType:AccountType):LocaleTexts {
        switch (accountType) {
            case AccountType.OTHER:
            {
                return AccountFactory.ACCOUNT_TYPE_OTHER_LABEL;
            }
            case AccountType.PAYMENT:
            {
                return AccountFactory.ACCOUNT_TYPE_PAIMENT_LABEL;
            }
            case AccountType.VAT:
            {
                return AccountFactory.ACCOUNT_TYPE_VAT_LABEL;
            }
        }
        return null;
    }

    static createNewAccount(desc:any):Account {
        return <any>AccountRecord(desc);
    }

}
