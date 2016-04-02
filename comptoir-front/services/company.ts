/**
 * Created by cghislai on 06/08/15.
 */

import {Injectable} from 'angular2/core';

import {WsCompany, WsCompanyRef, WsCompanyFactory} from '../client/domain/company/company';
import {WsCountryRef} from '../client/domain/company/country';

import {LocalCompany, LocalCompanyFactory} from '../domain/company';
import {LocalAccount} from '../domain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';
import {WsUtils} from '../client/utils/wsClient';

import {CompanyClient} from '../client/client/company';

import {CountryService} from './country';

/**
 * Required by AuthService: Auth -> Employee -> Company
 * Do not inject authService
 */
@Injectable()
export class CompanyService {

    companyClient:CompanyClient;
    countryService:CountryService;

    constructor(companyClient:CompanyClient,
                countryService:CountryService) {
        this.companyClient = companyClient;
        this.countryService = countryService;
    }

    get(id:number, authToken:string):Promise<LocalCompany> {
        return this.companyClient.doGet(id, authToken)
            .toPromise()
            .then((entity:WsCompany)=> {
                return this.toLocalConverter(entity, authToken);
            });
    }

    remove(id:number, authToken:string):Promise<any> {
        return this.companyClient.doRemove(id, authToken)
            .toPromise();
    }

    save(entity:LocalCompany, authToken:string):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.companyClient.doSave(e, authToken)
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalCompany>, authToken:string):Promise<SearchResult<LocalCompany>> {
        return this.companyClient.doSearch(searchRequest, authToken)
            .toPromise()
            .then((result:SearchResult<WsCompany>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity, authToken)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalCompany>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    uploadImportDataFile(data:any, companyRef:WsCompanyRef, authToken:string,
                         progressCallback?:(precentage:number)=>any):Promise<any> {
        var request = new XMLHttpRequest();
        var url = this.companyClient.webServiceUrl + this.companyClient.resourcePath + '/' + companyRef.id + '/import';


        var self = this;
        if (progressCallback != null) {
            request.upload.addEventListener("progress", function (e:ProgressEvent) {
                if (e.lengthComputable) {
                    var percentage = Math.round((e.loaded * 100) / e.total);
                    progressCallback(percentage);
                }
            }, false);
        }

        return new Promise<any>((resolve, reject)=> {
            request.upload.addEventListener("load", function (e) {
                resolve(e);
            }, false);
            request.open("POST", url);

            request.onreadystatechange = function () {
                if (request.readyState !== 4) {
                    return;
                }
                if (request.status !== 200 && request.status !== 204) {
                    reject(new Error('XMLHttpRequest Error: ' + request.status + " : " + request.statusText));
                    return;
                }
                resolve(request.status);
            };
            request.onerror = function () {
                reject(new Error('XMLHttpRequest Error: ' + request.statusText));
            };

            request.setRequestHeader('Content-Type', 'multipart/form-data; charset=UTF-8');
            if (authToken != null) {
                request.setRequestHeader(WsUtils.HEADER_AUTHORIZATION, 'Bearer ' + authToken);
            }
            request.send(data);
        });
    }


    toLocalConverter(company:WsCompany, authToken:string):Promise<LocalCompany> {
        var localCompanyDesc:any = {};
        localCompanyDesc.description = company.description;
        localCompanyDesc.id = company.id;
        localCompanyDesc.name = company.name;
        localCompanyDesc.customerLoyaltyRate = company.customerLoyaltyRate;

        var taskList = [];
        var countryRef = company.countryRef;

        taskList.push(
            this.countryService.get(countryRef.code, authToken)
                .then((country)=> {
                    localCompanyDesc.country = country;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return LocalCompanyFactory.createNewCompany(localCompanyDesc);
            });
    }

    fromLocalConverter(localCompany:LocalCompany):WsCompany {
        var company = new WsCompany();
        company.id = localCompany.id;
        company.countryRef = new WsCountryRef(localCompany.country.code);
        company.description = localCompany.description;
        company.name = localCompany.name;
        company.customerLoyaltyRate = localCompany.customerLoyaltyRate;
        return company;
    }

}