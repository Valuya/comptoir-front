/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {WsItemVariant, WsItemVariantFactory} from './../domain/commercial/itemVariant';
import {CachedWSClient} from './../utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../../config/service';

@Injectable()
export class ItemVariantClient extends CachedWSClient<WsItemVariant> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/itemVariant';
        this.webServiceUrl = serviceUrl;
        this.fromJSONReviver = WsItemVariantFactory.fromJSONReviver;
        this.toJSONReplacer = WsItemVariantFactory.toJSONReplacer;
    }
}