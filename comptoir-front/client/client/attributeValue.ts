/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {WsAttributeValue, WsAttributeValueFactory} from './../domain/commercial/attributeValue';
import {CachedWSClient} from './../utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../../config/service';

@Injectable()
export class AttributeValueClient extends CachedWSClient<WsAttributeValue> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/attribute/value';
        this.webServiceUrl = serviceUrl;
        this.fromJSONReviver = WsAttributeValueFactory.fromJSONReviver;
        this.toJSONReplacer = WsAttributeValueFactory.toJSONReplacer;
    }
}