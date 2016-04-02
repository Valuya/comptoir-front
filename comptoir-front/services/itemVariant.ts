/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from "angular2/core";
import {WsItemVariant} from "../client/domain/commercial/itemVariant";
import {WsAttributeValueRef} from "../client/domain/commercial/attributeValue";
import {WsItemRef} from "../client/domain/commercial/item";
import {WsPictureRef} from "../client/domain/commercial/picture";
import {ItemVariant, ItemVariantFactory} from "../domain/commercial/itemVariant";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {ItemVariantClient} from "../client/client/itemVariant";
import {AuthService} from "./auth";
import {AttributeValueService} from "./attributeValue";
import {ItemService} from "./item";
import {PictureService} from "./picture";

@Injectable()
export class ItemVariantService {
    private itemVariantClient:ItemVariantClient;
    private authService:AuthService;
    private attributeValueService:AttributeValueService;
    private itemService:ItemService;
    private pictureService:PictureService;


    constructor(itemVariantClient:ItemVariantClient,
                authService: AuthService,
                attributeValueService:AttributeValueService,
                itemService:ItemService,
                pictureService:PictureService) {
        this.itemVariantClient = itemVariantClient;
        this.authService = authService;
        this.attributeValueService = attributeValueService;
        this.itemService = itemService;
        this.pictureService = pictureService;

    }

    get(id:number):Promise<ItemVariant> {
        return  this.itemVariantClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsItemVariant)=> {
                return this.toLocalConverter(entity);
            });
    }

    fetch(id: number) : Promise<ItemVariant> {
        return this.itemVariantClient.doFetch(id, this.getAuthToken())
            .toPromise()
            .then((entity: WsItemVariant)=>{
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return  this.itemVariantClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:ItemVariant):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return  this.itemVariantClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<ItemVariant>):Promise<SearchResult<ItemVariant>> {
        return  this.itemVariantClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsItemVariant>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<ItemVariant>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(itemVariant:WsItemVariant):Promise<ItemVariant> {
        var localVariantDesc:any = {};
        localVariantDesc.id = itemVariant.id;
        localVariantDesc.variantReference = itemVariant.variantReference;
        localVariantDesc.pricing = itemVariant.pricing;
        localVariantDesc.pricingAmount = itemVariant.pricingAmount;

        localVariantDesc.attributeValues = [];
        var taskList = [];
        var attributeValueRefList = itemVariant.attributeValueRefs;


         for (var attributeValueRef of attributeValueRefList) {
            var attributeid = attributeValueRef.id;
            taskList.push(
                this.attributeValueService.get(attributeid)
                    .then((localValue)=> {
                        localVariantDesc.attributeValues.push(localValue);
                    })
            );
        }

        var itemRef = itemVariant.itemRef;
        taskList.push(
            this.itemService.get(itemRef.id)
                .then((localItem)=> {
                    localVariantDesc.item = localItem;
                })
        );

        var mainPictureRef = itemVariant.mainPictureRef;
        if (mainPictureRef != null) {
            var picId = mainPictureRef.id;
            taskList.push(
                this.pictureService.get(picId)
                    .then((localPicture)=> {
                        localVariantDesc.mainPicture = localPicture;
                    })
            );
        }

        return Promise.all(taskList)
            .then(()=> {
                return ItemVariantFactory.createNewItemVariant(localVariantDesc);
            });
    }

    fromLocalConverter(localItemVariant:ItemVariant):WsItemVariant {
        var itemVariant:WsItemVariant = new WsItemVariant();
        itemVariant.attributeValueRefs = [];
        for (var localAttribute of localItemVariant.attributeValues) {
            var attributeValueRef:WsAttributeValueRef = new WsAttributeValueRef(localAttribute.id);
            itemVariant.attributeValueRefs.push(attributeValueRef);
        }
        itemVariant.id = localItemVariant.id;
        if (localItemVariant.item != null) {
            itemVariant.itemRef = new WsItemRef(localItemVariant.item.id);
        }
        if (localItemVariant.mainPicture != null) {
            itemVariant.mainPictureRef = new WsPictureRef(localItemVariant.mainPicture.id);
        }
        itemVariant.pricing = localItemVariant.pricing;
        itemVariant.pricingAmount = localItemVariant.pricingAmount;
        itemVariant.variantReference = localItemVariant.variantReference;
        return itemVariant;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}