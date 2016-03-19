/**
 * Created by cghislai on 06/08/15.
 */

import {Injectable} from 'angular2/core';

import {Company, CompanyRef, CompanyFactory} from '../client/domain/company';
import {CountryRef} from '../client/domain/country';

import {LocalCompany, LocalCompanyFactory} from '../client/localDomain/company';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';
import {WsUtils} from '../client/utils/wsClient';

import {CompanyClient} from '../client/company';

import {CountryService} from './country';
import {StockClient} from "../client/stock";
import {CompanyService} from "./company";
import {AuthService} from "./auth";
import {LocalStock} from "../client/localDomain/stock";
import {Stock} from "../client/domain/stock";
import {LocalStockFactory} from "../client/localDomain/stock";

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

    get(id:number, authToken:string):Promise<LocalStock> {
        return this.stockClient.doGet(id, authToken)
            .toPromise()
            .then((entity:Stock)=> {
                return this.toLocalConverter(entity, authToken);
            });
    }

    remove(id:number, authToken:string):Promise<any> {
        return this.stockClient.doRemove(id, authToken)
            .toPromise();
    }

    save(entity:LocalStock, authToken:string):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.stockClient.doSave(e, authToken)
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalStock>, authToken:string):Promise<SearchResult<LocalStock>> {
        return this.stockClient.doSearch(searchRequest, authToken)
            .toPromise()
            .then((result:SearchResult<Stock>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity, authToken)
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

    toLocalConverter(stock:Stock, authToken:string):Promise<LocalStock> {
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

    fromLocalConverter(localStock:LocalStock):Stock {
        var stock = new Stock();
        stock.id = localStock.id;
        stock.active = localStock.active;
        stock.description = localStock.description;
        stock.companyRef = new CompanyRef(localStock.company.id);
        return stock;
    }

}