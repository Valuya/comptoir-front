/**
 * Created by cghislai on 07/08/15.
 */

import {Registration, LoginResponse, AuthFactory} from 'client/domain/auth';
import {CompanyRef} from 'client/domain/company';
import {ComptoirRequest} from 'client/utils/request';
import {ServiceConfig} from 'client/utils/service';

export class AuthClient {

    private getLoginUrl():string {
        return ServiceConfig.URL + "/login";
    }

    private getRegisterUrl():string {
        return ServiceConfig.URL + "/registration";
    }

    login(login:string, password:string):Promise<LoginResponse> {
        var request = new ComptoirRequest();
        var body = {
            'login': login,
            'passwordHash': password
        };

        return request
            .post(body, this.getLoginUrl(), null)
            .then(function (response) {
                var loginResponse:LoginResponse = JSON.parse(response.text, AuthFactory.fromJSONLoginResponseReviver);
                return loginResponse;
            });
    }

    register(registration:Registration):Promise<CompanyRef> {
        var request = new ComptoirRequest();
        return request
            .post(registration, this.getRegisterUrl(), null)
            .then((response)=> {
                var companyRef: CompanyRef = JSON.parse(response.text);
                return companyRef;
            });
    }
}