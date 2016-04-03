/**
 * Created by cghislai on 14/08/15.
 */

import {WsCompanyRef} from "./../company/company";
import {LocaleTexts, LocaleTextsFactory} from "../../utils/lang";
import {WsRef} from "../util/ref";


export class WsStock {
    id:number;
    companyRef:WsCompanyRef;
    active:boolean;
    description:LocaleTexts;
}

export class WsStockRef extends WsRef<WsStock> {
}

export class WsStockFactory {
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