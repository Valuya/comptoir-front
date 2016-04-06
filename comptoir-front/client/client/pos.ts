/**
 * Created by cghislai on 15/01/16.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {WsPos, WsPosFactory} from './../domain/commercial/pos';
import {CachedWSClient} from './../utils/cachedWsClient';
import {COMPTOIR_SERVICE_URL} from '../../config/service';

@Injectable()
export class PosClient extends CachedWSClient<WsPos> {

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        super();
        this.http = http;
        this.resourcePath = '/pos';
        this.webServiceUrl = serviceUrl;
        this.fromJSONReviver = WsPosFactory.fromJSONReviver;
        this.toJSONReplacer = WsPosFactory.toJSONReplacer;
    }
}