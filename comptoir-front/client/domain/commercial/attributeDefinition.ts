/**
 * Created by cghislai on 04/08/15.
 */

import {WsCompanyRef} from "./../company/company";
import {LocaleTexts, LocaleTextsFactory} from "../../utils/lang";
import {WsRef} from "../util/ref";

export class WsAttributeDefinition {
    id:number;
    name:LocaleTexts;
    companyRef:WsCompanyRef;
}

export class WsAttributeDefinitionRef extends WsRef<WsAttributeDefinition> {
}


export class WsAttributeDefinitionFactory {

    static fromJSONReviver = (key, value)=> {
        switch (key) {
            case 'name':
                return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    };
}