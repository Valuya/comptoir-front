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
import {StockClient} from "../client/client/stock";
import {CompanyService} from "./company";
import {AuthService} from "./auth";
import {LocalStock} from "../domain/stock";
import {WsStock} from "../client/domain/stock/stock";
import {LocalStockFactory} from "../domain/stock";

/**
 * Required by AuthService: Auth -> Employee -> Company
 * Do not inject authService
 */
@Injectable()
export class StockService {

    stockClient:StockClient;
    authService:AuthService;
    companyService:CompanyService;

    constructor(stockClient:StockClient,
                authService:AuthService,
                companyService:CompanyService) {
        this.stockClient = stockClient;
        this.authService = authService;
        this.companyService = companyService;
    }

    get(id:number):Promise<LocalStock> {
        return this.stockClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsStock)=> {
                return this.toLocalConverter(entity, this.getAuthToken());
            });
    }

    remove(id:number):Promise<any> {
        return this.stockClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalStock):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.stockClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalStock>):Promise<SearchResult<LocalStock>> {
        return this.stockClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsStock>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity, this.getAuthToken())
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalStock>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }
    
    toLocalConverter(stock:WsStock, authToken:string):Promise<LocalStock> {
        var localStockDesc:any = {};
        localStockDesc.description = stock.description;
        localStockDesc.id = stock.id;
        localStockDesc.active = stock.active;

        var taskList = [];
        var companyRef = stock.companyRef;

        taskList.push(
            this.companyService.get(companyRef.id, authToken)
                .then((company)=> {
                    localStockDesc.company = company;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return LocalStockFactory.createNewStock(localStockDesc)
            });
    }

    fromLocalConverter(localStock:LocalStock):WsStock {
        var stock = new WsStock();
        stock.id = localStock.id;
        stock.active = localStock.active;
        stock.description = localStock.description;
        stock.companyRef = new WsCompanyRef(localStock.company.id);
        return stock;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}