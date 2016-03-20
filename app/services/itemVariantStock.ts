/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from 'angular2/core';

import {ItemVariantStock, ItemVariantStockRef, ItemVariantStockSearch, ItemVariantStockFactory} from '../client/domain/itemVariantStock';
import {ItemVariantRef} from '../client/domain/itemVariant';
import {StockRef} from '../client/domain/stock';

import {LocalItemVariantStock, LocalItemVariantStockFactory} from '../client/localDomain/itemVariantStock';
import {LocalAccount} from '../client/localDomain/account';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {ItemVariantStockClient} from '../client/itemVariantStock';

import {AuthService} from './auth';
import {ItemVariantService} from './itemVariant';
import {StockService} from './stock';

@Injectable()
export class ItemVariantStockService {
    private itemVariantStockClient:ItemVariantStockClient;
    private authService:AuthService;
    private itemVariantService:ItemVariantService;
    private stockService:StockService;


    constructor(itemVariantStockClient:ItemVariantStockClient,
                authService:AuthService,
                itemVariantService:ItemVariantService,
                stockService:StockService) {
        this.itemVariantStockClient = itemVariantStockClient;
        this.authService = authService;
        this.itemVariantService = itemVariantService;
        this.stockService = stockService;
    }


    fetch(id:number):Promise<LocalItemVariantStock> {
        return this.itemVariantStockClient.doFetch(id, this.getAuthToken())
            .toPromise()
            .then((entity:ItemVariantStock)=> {
                return this.toLocalConverter(entity);
            });
    }

    get(id:number):Promise<LocalItemVariantStock> {
        return this.itemVariantStockClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:ItemVariantStock)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.itemVariantStockClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalItemVariantStock):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.itemVariantStockClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalItemVariantStock>):Promise<SearchResult<LocalItemVariantStock>> {
        return this.itemVariantStockClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<ItemVariantStock>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalItemVariantStock>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(itemVariantStock:ItemVariantStock):Promise<LocalItemVariantStock> {
        var localItemStockDesc:any = {};
        localItemStockDesc.id = itemVariantStock.id;
        localItemStockDesc.startDateTime = itemVariantStock.startDateTime;
        localItemStockDesc.endDateTime= itemVariantStock.endDateTime;
        localItemStockDesc.quantity = itemVariantStock.quantity;
        localItemStockDesc.comment = itemVariantStock.comment;
        localItemStockDesc.stockChangeType = itemVariantStock.stockChangeType;
        localItemStockDesc.previousItemStockRef= itemVariantStock.previousItemStockRef;
        localItemStockDesc.stockChangeSaleRef = itemVariantStock.stockChangeSaleRef;

        var taskList = [];

        var itemVariantRef = itemVariantStock.itemVariantRef;
        taskList.push(
            this.itemVariantService.get(itemVariantRef.id)
                .then((localVariant)=> {
                    localItemStockDesc.itemVariant = localVariant;
                })
        );

        var stockRef = itemVariantStock.stockRef;
        taskList.push(
            this.stockService.get(stockRef.id)
                .then((localStock)=> {
                    localItemStockDesc.stock = localStock;
                })
        );


        return Promise.all(taskList)
            .then(()=> {
                return LocalItemVariantStockFactory.createNewItemVariantStock(localItemStockDesc);
            });
    }

    fromLocalConverter(localItemVariantStock:LocalItemVariantStock):ItemVariantStock {
        var itemStock = new ItemVariantStock();
        itemStock.id = localItemVariantStock.id;
        itemStock.startDateTime = localItemVariantStock.startDateTime;
        itemStock.endDateTime = localItemVariantStock.endDateTime;
        itemStock.itemVariantRef = new ItemVariantRef(localItemVariantStock.itemVariant.id);
        itemStock.stockRef = new StockRef(localItemVariantStock.stock.id);
        itemStock.quantity = localItemVariantStock.quantity;
        itemStock.comment = localItemVariantStock.comment;
        itemStock.stockChangeType = localItemVariantStock.stockChangeType;
        itemStock.stockChangeSaleRef = localItemVariantStock.stockChangeSaleRef;
        itemStock.previousItemStockRef = localItemVariantStock.previousItemStockRef;

        return itemStock;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}