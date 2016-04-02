/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from "angular2/core";
import {WsItemVariantSale} from "../client/domain/commercial/itemVariantSale";
import {WsItemVariantRef} from "../client/domain/commercial/itemVariant";
import {WsSaleRef} from "../client/domain/commercial/sale";
import {ItemVariantSale, ItemVariantSaleFactory} from "../domain/commercial/itemVariantSale";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {ItemVariantSaleClient} from "../client/client/itemVariantSale";
import {AuthService} from "./auth";
import {ItemVariantService} from "./itemVariant";
import {SaleService} from "./sale";
import {StockService} from "./stock";
import {WsStockRef} from "../client/domain/stock/stock";

@Injectable()
export class ItemVariantSaleService {
    private itemVariantSaleClient:ItemVariantSaleClient;
    private authService:AuthService;
    private itemVariantService:ItemVariantService;
    private saleService:SaleService;
    private stockService:StockService;


    constructor(itemVariantSaleClient:ItemVariantSaleClient,
                authService:AuthService,
                itemVariantService:ItemVariantService,
                stockService:StockService,
                saleService:SaleService) {
        this.itemVariantSaleClient = itemVariantSaleClient;
        this.authService = authService;
        this.itemVariantService = itemVariantService;
        this.stockService = stockService;
        this.saleService = saleService;
    }


    fetch(id:number):Promise<ItemVariantSale> {
        return this.itemVariantSaleClient.doFetch(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsItemVariantSale)=> {
                return this.toLocalConverter(entity);
            });
    }

    get(id:number):Promise<ItemVariantSale> {
        return this.itemVariantSaleClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsItemVariantSale)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.itemVariantSaleClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:ItemVariantSale):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.itemVariantSaleClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<ItemVariantSale>):Promise<SearchResult<ItemVariantSale>> {
        return this.itemVariantSaleClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsItemVariantSale>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<ItemVariantSale>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(itemVariantSale:WsItemVariantSale):Promise<ItemVariantSale> {
        var localItemSaleDesc:any = {};
        localItemSaleDesc.comment = itemVariantSale.comment;
        localItemSaleDesc.dateTime = itemVariantSale.dateTime;
        localItemSaleDesc.discountRatio = itemVariantSale.discountRatio;
        localItemSaleDesc.id = itemVariantSale.id;
        localItemSaleDesc.quantity = itemVariantSale.quantity;
        localItemSaleDesc.total = itemVariantSale.total;
        localItemSaleDesc.vatExclusive = itemVariantSale.vatExclusive;
        localItemSaleDesc.vatRate = itemVariantSale.vatRate;
        localItemSaleDesc.includeCustomerLoyalty = itemVariantSale.includeCustomerLoyalty;

        var taskList = [];

        var itemVariantRef = itemVariantSale.itemVariantRef;
        taskList.push(
            this.itemVariantService.get(itemVariantRef.id)
                .then((localVariant)=> {
                    localItemSaleDesc.itemVariant = localVariant;
                })
        );

        var saleRef = itemVariantSale.saleRef;
        taskList.push(
            this.saleService.get(saleRef.id)
                .then((localSale)=> {
                    localItemSaleDesc.sale = localSale;
                })
        );

        var stockRef = itemVariantSale.stockRef;
        if (stockRef != null) {
            taskList.push(
                this.stockService.get(stockRef.id)
                    .then((stock)=> {
                        localItemSaleDesc.stock = stock;
                    })
            );
        }

        return Promise.all(taskList)
            .then(()=> {
                return ItemVariantSaleFactory.createNewItemVariantSale(localItemSaleDesc);
            });
    }

    fromLocalConverter(localItemVariantSale:ItemVariantSale):WsItemVariantSale {
        var itemSale = new WsItemVariantSale();
        itemSale.comment = localItemVariantSale.comment;
        itemSale.dateTime = localItemVariantSale.dateTime;
        itemSale.discountRatio = localItemVariantSale.discountRatio;
        itemSale.id = localItemVariantSale.id;
        itemSale.itemVariantRef = new WsItemVariantRef(localItemVariantSale.itemVariant.id);
        itemSale.quantity = localItemVariantSale.quantity;
        itemSale.saleRef = new WsSaleRef(localItemVariantSale.sale.id);
        itemSale.total = localItemVariantSale.total;
        itemSale.vatExclusive = localItemVariantSale.vatExclusive;
        itemSale.vatRate = localItemVariantSale.vatRate;
        itemSale.includeCustomerLoyalty = localItemVariantSale.includeCustomerLoyalty;
        if (localItemVariantSale.stock != null) {
            itemSale.stockRef = new WsStockRef(localItemVariantSale.stock.id);
        }
        return itemSale;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}