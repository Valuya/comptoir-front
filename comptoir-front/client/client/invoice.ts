/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {WsInvoice, WsInvoiceFactory} from './../domain/commercial/invoice';
import {CachedWSClient} from './../utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../../config/service';

@Injectable()
export class InvoiceClient extends CachedWSClient<WsInvoice> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/invoice';
        this.webServiceUrl = serviceUrl;
        this.fromJSONReviver = WsInvoiceFactory.fromJSONReviver;
        this.toJSONReplacer = WsInvoiceFactory.toJSONReplacer;
    }
}