/**
 * Created by cghislai on 01/09/15.
 */

import {Company} from "./../company/company";
import {Picture} from "./picture";
import * as Immutable from "immutable";
import {LocaleTexts} from "../../client/utils/lang";

export interface Item extends Immutable.Map<string, any> {
    id:number;
    company:Company;
    reference:string;
    name:LocaleTexts;
    description:LocaleTexts;

    vatExclusive:number;
    vatRate:number;

    mainPicture:Picture;
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

export class ItemFactory {

    static createNewItem(desc:any):Item {
        return <any>ItemRecord(desc);
    }
}
