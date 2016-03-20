/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {ItemVariantSale, ItemVariantSaleFactory} from './domain/itemVariantSale';
import {CachedWSClient} from './utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../config/service';
import {ItemVariantStock} from "./domain/itemVariantStock";

@Injectable()
export class ItemVariantStockClient extends CachedWSClient<ItemVariantStock> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/itemVariantStock';
        this.webServiceUrl = serviceUrl;
        this.jsonReviver = ItemVariantSaleFactory.fromJSONReviver;
    }
}