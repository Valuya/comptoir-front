/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {WsSale, WsSaleFactory} from './../domain/commercial/sale';
import {CachedWSClient} from './../utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../../config/service';

@Injectable()
export class SaleClient extends CachedWSClient<WsSale> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/sale';
        this.webServiceUrl = serviceUrl;
        this.jsonReviver = WsSaleFactory.fromJSONReviver;
    }
}