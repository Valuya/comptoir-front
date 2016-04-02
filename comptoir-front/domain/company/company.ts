/**
 * Created by cghislai on 08/09/15.
 */

import * as Immutable from "immutable";
import {LocaleTexts} from "../../client/utils/lang";
import {WsCountry} from "../../client/domain/company/country";

export interface Company extends Immutable.Map<string, any> {
    id: number;
    name: LocaleTexts;
    description: LocaleTexts;
    // tODO: LocalCountry
    country: WsCountry;
    customerLoyaltyRate: number;
}
var CompanyRecord = Immutable.Record({
    id: null,
    name: null,
    description: null,
    country: null,
    customerLoyaltyRate: null
});

export class CompanyFactory {

    static createNewCompany(desc:any):Company {
        return <any>CompanyRecord(desc);
    }
}