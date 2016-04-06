/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {WsStock, WsStockFactory} from './../domain/stock/stock';
import {CachedWSClient} from './../utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../../config/service';

@Injectable()
export class StockClient extends CachedWSClient<WsStock> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/stock';
        this.webServiceUrl = serviceUrl;
        this.fromJSONReviver = WsStockFactory.fromJSONReviver;
        this.toJSONReplacer = WsStockFactory.toJSONReplacer;
    }
}