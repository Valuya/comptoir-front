/**
 * Created by cghislai on 07/08/15.
 */
import {Injectable} from 'angular2/core';

import {WsCountry, WsCountryFactory} from '../client/domain/company/country';
import {Country, CountryFactory} from '../domain/company/country';


import {CountryClient} from '../client/client/country';


/**
 * Required by authService: Auth->employee->company->country
 * Do not inject
 */
@Injectable()
export class CountryService {
    countryClient:CountryClient;

    constructor(countryClient:CountryClient) {
        this.countryClient = countryClient;
    }

    get(code:string, authToken:string):Promise<WsCountry> {
        return this.countryClient.getFromCacheOrServer(code, authToken);
    }

    search(authToken:string):Promise<Immutable.List<WsCountry>> {
        return this.countryClient.search(authToken);
    }
}
