/**
 * Created by cghislai on 01/09/15.
 */


import {WsCompanyRef} from "./../company/company";
import {WsPictureRef} from "./picture";
import {LocaleTexts, LocaleTextsFactory} from "../../utils/lang";
import {WsRef} from "../util/ref";


export class WsItem {
    id: number;
    companyRef:WsCompanyRef;
    reference: string;
    name:LocaleTexts;
    description:LocaleTexts;

    vatExclusive:number;
    vatRate:number;

    mainPictureRef:WsPictureRef;
    multipleSale: boolean;
}

export class WsItemRef extends WsRef<WsItem> {
}


export class WsItemFactory {
    static fromJSONReviver = (key, value)=> {
        switch (key) {
            case 'name':
            case 'description':
                return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }
}