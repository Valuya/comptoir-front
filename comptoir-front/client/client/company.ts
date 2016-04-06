/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {WsCompany, WsCompanyFactory} from './../domain/company/company';
import {CachedWSClient} from './../utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../../config/service';

@Injectable()
export class CompanyClient extends CachedWSClient<WsCompany> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/company';
        this.webServiceUrl = serviceUrl;
        this.fromJSONReviver = WsCompanyFactory.fromJSONReviver;
        this.toJSONReplacer = WsCompanyFactory.toJSONReplacer;
    }
}