/**
 * Created by cghislai on 04/08/15.
 */


import {WsCompanyRef} from "./../company/company";
import {LocaleTexts, LocaleTextsFactory} from "../../utils/lang";
import {AccountType} from "../util/accountType";
import {WsRef} from "../util/ref";

export class WsAccount {
    id:number;
    companyRef:WsCompanyRef;
    accountingNumber:string;
    iban:string;
    bic:string;
    name:string;
    description:LocaleTexts;
    accountType:AccountType;
    cash:boolean;
}

export class WsAccountRef extends WsRef<WsAccount> {
}


export class WsAccountFactory {

    static fromJSONReviver = (key, value)=> {
        switch (key) {
            case 'description':
                return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
            case 'accountType':
                return AccountType[value];
        }
        return value;
    }

    static toJSONReplacer = (key, value)=>{
        switch (key) {
            case 'description':
                return LocaleTextsFactory.toJSONArrayLocaleTextsTransformer(value);
            case 'accountType':
                return AccountType[value];
        }
        return value;
    }
}
