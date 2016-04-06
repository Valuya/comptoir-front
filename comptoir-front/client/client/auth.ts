/**
 * Created by cghislai on 07/08/15.
 */

import {Injectable, Inject} from 'angular2/core';
import {Http} from 'angular2/http';

import {WsAuth, WsAuthFactory} from './../domain/auth/auth';
import {WsCompanyRef} from './../domain/company/company';
import {ComptoirRequest} from './../utils/request';
import {COMPTOIR_SERVICE_URL} from '../../config/service';
import {WsRegistration, WsRegistrationFactory} from "./../domain/thirdparty/registration";
import {WsLoginCredentials, WsLoginCredentialsFactory} from "../domain/auth/loginCredentials";
import {ApplicationRequestCache} from "../utils/applicationRequestCache";

export class AuthClient {
    serviceConfigUrl:string;

    constructor(@Inject(Http) http:Http, @Inject(COMPTOIR_SERVICE_URL) serviceUrl:string) {
        this.serviceConfigUrl = serviceUrl;
    }

    private getLoginUrl():string {
        return this.serviceConfigUrl + "/auth";
    }

    private getRegisterUrl():string {
        return this.serviceConfigUrl + "/registration";
    }

    private getRefreshUrl():string {
        return this.serviceConfigUrl + "/auth/refresh";
    }

    login(login:string, password:string):Promise<WsAuth> {
        var request = new ComptoirRequest();
        
        var body = new WsLoginCredentials();
        body.login = login;
        body.passwordHash = password;
        var bodyJSON = JSON.stringify(body, WsLoginCredentialsFactory.toJSONReviver);

        return request
            .post(bodyJSON, this.getLoginUrl(), null)
            .then(function (response) {
                var auth:WsAuth = JSON.parse(response.text, WsAuthFactory.fromJSONReviver);
                return auth;
            });
    }

    register(registration:WsRegistration):Promise<WsCompanyRef> {
        var request = new ComptoirRequest();
        var registrationJSON = JSON.stringify(registration, WsRegistrationFactory.toJSONReplacer);
        return request
            .post(registrationJSON, this.getRegisterUrl(), null)
            .then((response)=> {
                var companyRef:WsCompanyRef = JSON.parse(response.text);
                return companyRef;
            });
    }

    getRegisterRequest(registration:WsRegistration):ComptoirRequest {
        var request = new ComptoirRequest();
        var url = this.getRegisterUrl();
        request.setup('POST', url, null);
        var registrationJSON = JSON.stringify(registration, WsRegistrationFactory.toJSONReplacer);
        request.setupData(registrationJSON);
        return request;
    }

    refreshToken(refreshToken:string) {
        var request = new ComptoirRequest();
        var url = this.getRefreshUrl();
        url += "/" + refreshToken;
        return request
            .post(null, url, null)
            .then((response)=> {
                var auth:WsAuth = JSON.parse(response.text, WsAuthFactory.fromJSONReviver);
                return auth;
            });
    }
}