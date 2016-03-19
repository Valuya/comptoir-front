/**
 * Created by cghislai on 01/09/15.
 */


import {LocalCompany} from './company';

import * as Immutable from 'immutable';
import {LocaleTexts} from "../utils/lang";

export interface LocalStock extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    description: LocaleTexts;
    active:boolean;
}
var StockRecord = Immutable.Record({
    id: null,
    company: null,
    active: null
});

export class LocalStockFactory {

    static createNewStock(desc:any):LocalStock {
        return <any>StockRecord(desc);
    }

}