/**
 * Created by cghislai on 08/09/15.
 */

import * as Immutable from "immutable";

export interface Country extends Immutable.Map<string, any> {
    code: string;
    defaultVatRate: number;
}
var CountryRecord = Immutable.Record({
    code: null,
    defaultVatRate: null
});

export class CountryFactory {

    static createNewCountry(desc:any):Country {
        return <any>CountryRecord(desc);
    }
}