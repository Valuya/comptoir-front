/**
 * Created by cghislai on 04/08/15.
 */

import {Company, CompanyRef, CompanyFactory} from 'client/domain/company';
import {ComptoirRequest} from 'client/utils/request';
import {SearchResult} from 'client/utils/search';
import {ServiceConfig} from 'client/utils/service';

export class CompanyClient {

    private static RESOURCE_PATH="/company";

    private getCompanyUrl(id?:number) {
        var url = ServiceConfig.URL + CompanyClient.RESOURCE_PATH;
        if (id != undefined) {
            url += "/" + id;
        }
        return url;
    }
    private getSearchUrl() {
        var url = ServiceConfig.URL + CompanyClient.RESOURCE_PATH;
        url += '/search';
        return url;
    }

    createCompany(company:Company, authToken: string):Promise<CompanyRef> {
        var request = new ComptoirRequest();
        var url = this.getCompanyUrl();
        return request
            .post(company, url, authToken)
            .then(function (response) {
                var companyRef = JSON.parse(response.text);
                return companyRef;
            });
    }

    updateCompany(company:Company, authToken: string):Promise<CompanyRef> {
        var request = new ComptoirRequest();
        var url = this.getCompanyUrl(company.id);

        return request
            .put(company, url, authToken)
            .then(function (response) {
                var companyRef = JSON.parse(response.text);
                return companyRef;
            });
    }

    getCompany(id:number, authToken: string):Promise<Company> {
        var request = new ComptoirRequest();
        var url = this.getCompanyUrl(id);

        return request
            .get(url, authToken)
            .then(function (response) {
                var company = JSON.parse(response.text, CompanyFactory.fromJSONCompanyReviver);
                return company;
            });
    }

}