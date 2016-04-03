/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {WsItemVariantSale, WsItemVariantSaleFactory} from './../domain/commercial/itemVariantSale';
import {CachedWSClient} from './../utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../../config/service';
import {WsItemVariantStock, WsItemVariantStockFactory} from "./../domain/stock/itemVariantStock";

@Injectable()
export class ItemVariantStockClient extends CachedWSClient<WsItemVariantStock> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/itemVariantStock';
        this.webServiceUrl = serviceUrl;
        this.fromJSONReviver = WsItemVariantStockFactory.fromJSONReviver;
        this.toJSONReplacer = WsItemVariantStockFactory.toJSONReplacer;
    }
}