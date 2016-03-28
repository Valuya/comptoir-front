/**
 * Created by cghislai on 08/09/15.
 */

import {Company, CompanyRef} from '../domain/company';
import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';
import {Country, CountryRef} from '../domain/country';

import * as Immutable from 'immutable';

export interface LocalCompany extends Immutable.Map<string, any> {
    id: number;
    name: LocaleTexts;
    description: LocaleTexts;
    // tODO: LocalCountry
    country: Country;
    customerLoyaltyRate: number;
}
var CompanyRecord = Immutable.Record({
    id: null,
    name: null,
    description: null,
    country: null,
    customerLoyaltyRate: null
});

export class LocalCompanyFactory {

    static createNewCompany(desc:any):LocalCompany {
        return <any>CompanyRecord(desc);
    }
}