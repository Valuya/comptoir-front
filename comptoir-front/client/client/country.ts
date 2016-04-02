/**
 * Created by cghislai on 06/08/15.
 */

import {Inject, Injectable} from "angular2/core";
import {WsCountry, WsCountryFactory} from "./../domain/company/country";
import {ComptoirRequest, ComptoirResponse} from "./../utils/request";
import {COMPTOIR_SERVICE_URL} from "../../config/service";

@Injectable()
export class CountryClient {

    private static RESOURCE_PATH:string = "/country";
    serviceConfigUrl:string;
    resourceCache:{[code:string]:WsCountry};

    constructor(@Inject(COMPTOIR_SERVICE_URL) serviceConfigUrl:string) {
        this.serviceConfigUrl = serviceConfigUrl;
        this.resourceCache = {};
    }

    private getCountryUrl(code?:string) {
        var url = this.serviceConfigUrl + CountryClient.RESOURCE_PATH;
        if (code !== undefined) {
            url += "/" + code;
        }
        return url;
    }

    getFromCacheOrServer(code:string, authToken:string):Promise<WsCountry> {
        var entityFromCache = this.resourceCache[code];
        if (entityFromCache != null) {
            return Promise.resolve(entityFromCache);
        } else {
            return this.getCountry(code, authToken);
        }
    }

    getCountry(code:string, authToken:string):Promise<WsCountry> {
        var request = new ComptoirRequest();
        var url = this.getCountryUrl(code);

        return request
            .get(url, authToken)
            .then((response)=> {
                var country = JSON.parse(response.text, WsCountryFactory.fromJSONReviver);
                this.resourceCache[country.code] = country;
                return country;
            });
    }

    getGetCountryRequest(code:string, authToken:string):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getCountryUrl(code);
        request.setup('GET', url, authToken);
        return request;
    }

    search(authToken:string):Promise<Immutable.List<WsCountry>> {
        var request = new ComptoirRequest();
        var url = this.getCountryUrl() + "/search";
        request.setup('POST', url, authToken);
        return request.run()
            .then((response:ComptoirResponse)=> {
                var countries:WsCountry[] = JSON.parse(response.text);
                var countriesList = Immutable.List<WsCountry>(countries);
                return countriesList;
            });
    }

}