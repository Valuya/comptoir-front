/**
 * Created by cghislai on 04/08/15.
 */

import {LocaleTexts, LocaleTextsFactory} from "../../utils/lang";
import {WsCountryRef} from "./country";
import {WsRef} from "../util/ref";


export class WsCompany {
    id:number;
    name:LocaleTexts;
    description:LocaleTexts;
    countryRef:WsCountryRef;
    customerLoyaltyRate:number;
}

export class WsCompanyRef extends WsRef<WsCompany> {
}

export class WsCompanyFactory {
    static fromJSONReviver = (key, value)=> {
        switch (key) {
            case 'name':
            case 'description':
                return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    };
    static toJSONReplacer = (key, value)=> {
        switch (key) {
            case 'name':
            case 'description':
                return LocaleTextsFactory.toJSONArrayLocaleTextsTransformer(value);
        }
        return value;
    };

}