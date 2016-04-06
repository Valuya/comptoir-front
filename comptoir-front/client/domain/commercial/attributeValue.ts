/**
 * Created by cghislai on 04/08/15.
 */

import {WsAttributeDefinitionRef} from "./attributeDefinition";
import {LocaleTexts, LocaleTextsFactory} from "../../utils/lang";
import {WsRef} from "../util/ref";

export class WsAttributeValue {
    id:number;
    attributeDefinitionRef:WsAttributeDefinitionRef;
    value:LocaleTexts;
}

export class WsAttributeValueRef extends WsRef<WsAttributeValue> {
}


export class WsAttributeValueFactory {

    static fromJSONReviver = (key, value)=> {
        switch (key) {
            case 'value':
                return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    };
    static toJSONReplacer = (key, value)=> {
        switch (key) {
            case 'value':
                return LocaleTextsFactory.toJSONArrayLocaleTextsTransformer(value);
        }
        return value;
    };
}