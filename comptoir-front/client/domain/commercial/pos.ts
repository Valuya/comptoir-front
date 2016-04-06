/**
 * Created by cghislai on 14/08/15.
 */

import {WsCompanyRef} from "./../company/company";
import {WsCustomerRef} from "./../thirdparty/customer";
import {LocaleTexts, LocaleTextsFactory} from "../../utils/lang";
import {WsRef} from "../util/ref";


export class WsPos {
    id:number;
    companyRef:WsCompanyRef;
    name:string;
    description:LocaleTexts;
    defaultCustomerRef:WsCustomerRef;
}

export class WsPosRef extends WsRef<WsPos> {
}


export class WsPosFactory {
    static fromJSONReviver = (key, value)=> {
        switch (key) {
            case 'description':
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }
    static toJSONReplacer = (key, value)=> {
        switch (key) {
            case 'description':
            return LocaleTextsFactory.toJSONArrayLocaleTextsTransformer(value);
        }
        return value;
    }

}