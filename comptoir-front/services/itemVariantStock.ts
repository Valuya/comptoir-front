/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from "angular2/core";
import {WsItemVariantStock} from "../client/domain/stock/itemVariantStock";
import {WsItemVariantRef} from "../client/domain/commercial/itemVariant";
import {WsStockRef} from "../client/domain/stock/stock";
import {LocalItemVariantStock, LocalItemVariantStockFactory} from "../domain/itemVariantStock";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {ItemVariantStockClient} from "../client/client/itemVariantStock";
import {AuthService} from "./auth";
import {ItemVariantService} from "./itemVariant";
import {StockService} from "./stock";
import {LocalItemVariant} from "../domain/itemVariant";
import {LocalStock} from "../domain/stock";
import {PaginationFactory} from "../client/utils/pagination";
import {ItemVariantSaleService} from "./itemVariantSale";
import {WsItemVariantSaleRef} from "../client/domain/commercial/itemVariantSale";
import {WsItemVariantStockSearch} from "../client/domain/search/itemVariantStockSearch";
import {StockChangeType} from "../client/domain/util/stockChangeType";

@Injectable()
export class ItemVariantStockService {
    private itemVariantStockClient:ItemVariantStockClient;
    private authService:AuthService;
    private itemVariantService:ItemVariantService;
    private itemVariantSaleService:ItemVariantSaleService;
    private stockService:StockService;


    constructor(itemVariantStockClient:ItemVariantStockClient,
                authService:AuthService,
                itemVariantService:ItemVariantService,
                itemVariantSaleService:ItemVariantSaleService,
                stockService:StockService) {
        this.itemVariantStockClient = itemVariantStockClient;
        this.authService = authService;
        this.itemVariantService = itemVariantService;
        this.itemVariantSaleService = itemVariantSaleService;
        this.stockService = stockService;
    }


    fetch(id:number):Promise<LocalItemVariantStock> {
        return this.itemVariantStockClient.doFetch(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsItemVariantStock)=> {
                return this.toLocalConverter(entity);
            });
    }

    get(id:number):Promise<LocalItemVariantStock> {
        return this.itemVariantStockClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsItemVariantStock)=> {
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
            .then((result:SearchResult<WsItemVariantStock>)=> {
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

    fetchCurrentItemStock(itemVariant:LocalItemVariant, stock:LocalStock):Promise<LocalItemVariantStock> {
        if (itemVariant == null || stock == null) {
            return Promise.resolve(null);
        }
        var itemStockSearch = new WsItemVariantStockSearch();
        itemStockSearch.companyRef = this.authService.getEmployeeCompanyRef();
        itemStockSearch.itemVariantRef = new WsItemVariantRef(itemVariant.id);
        itemStockSearch.stockRef = new WsStockRef(stock.id);
        itemStockSearch.atDateTime = new Date();

        var searchRequest = new SearchRequest<LocalItemVariantStock>();
        searchRequest.search = itemStockSearch;
        searchRequest.pagination = PaginationFactory.Pagination({
            firstIndex: 0,
            pageSize: 1
        });

        return this.search(searchRequest)
            .then((result:SearchResult<LocalItemVariantStock>)=> {
                if (result.count > 0) {
                    var localStock = result.list.first();
                    //itemVariant = <LocalItemVariant>itemVariant.set('currentStock', localStock);
                    // TODO: store in cache?
                    return localStock;
                }
                return null;
            });
    }


    toLocalConverter(itemVariantStock:WsItemVariantStock):Promise<LocalItemVariantStock> {
        var localItemStockDesc:any = {};
        localItemStockDesc.id = itemVariantStock.id;
        localItemStockDesc.startDateTime = itemVariantStock.startDateTime;
        localItemStockDesc.endDateTime = itemVariantStock.endDateTime;
        localItemStockDesc.quantity = itemVariantStock.quantity;
        localItemStockDesc.comment = itemVariantStock.comment;
        var stockChangeType = StockChangeType[itemVariantStock.stockChangeType];
        localItemStockDesc.stockChangeType = stockChangeType;
        localItemStockDesc.previousItemStockRef = itemVariantStock.previousItemStockRef;
        localItemStockDesc.orderPosition = itemVariantStock.orderPosition;

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
        var stockChangeVariantSaleRef = itemVariantStock.stockChangeVariantSaleRef;
        if (stockChangeVariantSaleRef != null) {
            taskList.push(
                this.itemVariantSaleService.get(stockChangeVariantSaleRef.id)
                    .then((localVariantSale)=> {
                        localItemStockDesc.stockChangeVariantSale = localVariantSale;
                    })
            );
        }


        return Promise.all(taskList)
            .then(()=> {
                return LocalItemVariantStockFactory.createNewItemVariantStock(localItemStockDesc);
            });
    }

    fromLocalConverter(localItemVariantStock:LocalItemVariantStock):WsItemVariantStock {
        var itemStock = new WsItemVariantStock();
        itemStock.id = localItemVariantStock.id;
        itemStock.startDateTime = localItemVariantStock.startDateTime;
        itemStock.endDateTime = localItemVariantStock.endDateTime;

        var itemVariant = localItemVariantStock.itemVariant;
        if (itemVariant != null) {
            itemStock.itemVariantRef = new WsItemVariantRef(localItemVariantStock.itemVariant.id);
        }
        var stock = localItemVariantStock.stock;
        if (stock != null) {
            itemStock.stockRef = new WsStockRef(localItemVariantStock.stock.id);
        }
        itemStock.quantity = localItemVariantStock.quantity;
        itemStock.comment = localItemVariantStock.comment;
        itemStock.stockChangeType = localItemVariantStock.stockChangeType;
        var stockChangeVariantSale = localItemVariantStock.stockChangeVariantSale;
        if (stockChangeVariantSale != null) {
            itemStock.stockChangeVariantSaleRef = new WsItemVariantSaleRef(stockChangeVariantSale.id);
        }
        itemStock.previousItemStockRef = localItemVariantStock.previousItemStockRef;
        itemStock.orderPosition = localItemVariantStock.orderPosition;

        return itemStock;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}