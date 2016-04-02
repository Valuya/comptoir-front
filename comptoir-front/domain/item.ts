/**
 * Created by cghislai on 01/09/15.
 */

import {LocalCompany} from "./company";
import {LocalPicture} from "./picture";
import * as Immutable from "immutable";
import {LocaleTexts} from "../client/utils/lang";

export interface LocalItem extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    reference:string;
    name:LocaleTexts;
    description:LocaleTexts;

    vatExclusive:number;
    vatRate:number;

    mainPicture:LocalPicture;
    multipleSale: boolean;
}

var ItemRecord = Immutable.Record({
    id: null,
    company: null,
    reference: null,
    name: null,
    description: null,
    vatExclusive: null,
    vatRate: null,
    mainPicture: null,
    multipleSale: null
});

export class LocalItemFactory {

    static createNewItem(desc:any):LocalItem {
        return <any>ItemRecord(desc);
    }
}
