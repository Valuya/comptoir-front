/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from './company';
import {LocaleTexts} from "../utils/lang";
import {LocaleTextsFactory} from "../utils/lang";


export class Stock {
    id:number;
    companyRef:CompanyRef;
    active: boolean;
    description: LocaleTexts;
}

export class StockRef {
    id:number;
    link:string;

    constructor(id?:number) {
        this.id = id;
    }
}

export class StockSearch {
    companyRef:CompanyRef;
    active:boolean;
}

export class StockFactory {
    static fromJSONReviver = (key, value)=> {
        if (key ==='description') {
            return LocaleTextsFactory.fromLocaleTextArrayReviver(value);
        }
        return value;
    }


}