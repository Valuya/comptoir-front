/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from "angular2/core";
import {WsItem} from "../client/domain/commercial/item";
import {WsCompanyRef} from "../client/domain/company/company";
import {WsPictureRef} from "../client/domain/commercial/picture";
import {Item, ItemFactory} from "../domain/commercial/item";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {ItemClient} from "../client/client/item";
import {AuthService} from "./auth";
import {CompanyService} from "./company";
import {PictureService} from "./picture";

@Injectable()
export class ItemService {
    private itemClient:ItemClient;
    private authService:AuthService;
    private companyService:CompanyService;
    private pictureService:PictureService;


    constructor(itemClient:ItemClient,
                authService:AuthService,
                companyService:CompanyService,
                pictureService:PictureService) {
        this.itemClient = itemClient;
        this.authService = authService;
        this.companyService = companyService;
        this.pictureService = pictureService;

    }

    get(id:number):Promise<Item> {
        return this.itemClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsItem)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.itemClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:Item):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.itemClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<Item>):Promise<SearchResult<Item>> {
        return this.itemClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsItem>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<Item>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(item:WsItem):Promise<Item> {
        var localItemDesc:any = {};
        localItemDesc.description = item.description;
        localItemDesc.id = item.id;
        localItemDesc.name = item.name;
        localItemDesc.multipleSale = item.multipleSale;
        localItemDesc.reference = item.reference;
        localItemDesc.vatExclusive = item.vatExclusive;
        localItemDesc.vatRate = item.vatRate;

        var taskList = [];
        var companyRef = item.companyRef;

        taskList.push(
            this.companyService.get(companyRef.id, this.getAuthToken())
                .then((localCompany)=> {
                    localItemDesc.company = localCompany;
                })
        );

        var mainPictureRef = item.mainPictureRef;
        if (mainPictureRef != null) {
            var picId = mainPictureRef.id;
            taskList.push(
                this.pictureService.get(picId)
                    .then((localPicture)=> {
                        localItemDesc.mainPicture = localPicture;
                    })
            );
        }
        return Promise.all(taskList)
            .then(()=> {
                return ItemFactory.createNewItem(localItemDesc);
            });
    }

    fromLocalConverter(localItem:Item):WsItem {
        var item = new WsItem();
        item.companyRef = new WsCompanyRef(localItem.company.id);
        item.description = localItem.description;
        item.id = localItem.id;
        if (localItem.mainPicture != null) {
            var picId = localItem.mainPicture.id;
            var picRef = new WsPictureRef(picId)
            item.mainPictureRef = picRef;
        }
        item.name = localItem.name;
        item.multipleSale = localItem.multipleSale;
        item.reference = localItem.reference;
        item.vatExclusive = localItem.vatExclusive;
        item.vatRate = localItem.vatRate;
        return item;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}