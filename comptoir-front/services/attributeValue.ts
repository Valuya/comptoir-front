/**
 * Created by cghislai on 29/07/15.
 */
import {Injectable} from "angular2/core";
import {WsAttributeValue} from "../client/domain/commercial/attributeValue";
import {WsAttributeDefinitionRef} from "../client/domain/commercial/attributeDefinition";
import {LocalAttributeValue, LocalAttributeValueFactory} from "../domain/attributeValue";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {AttributeValueClient} from "../client/client/attributeValue";
import {AuthService} from "./auth";
import {AttributeDefinitionService} from "./attributeDefinition";

@Injectable()
export class AttributeValueService {

    attributeValueClient:AttributeValueClient;
    authService:AuthService;
    attributeDefinitionService:AttributeDefinitionService;

    constructor(attributeValueClient:AttributeValueClient,
                authService:AuthService,
                attribureDefinitionService:AttributeDefinitionService) {
        this.attributeValueClient = attributeValueClient;
        this.authService = authService;
        this.attributeDefinitionService = attribureDefinitionService;

    }

    get(id:number):Promise<LocalAttributeValue> {
        return this.attributeValueClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsAttributeValue)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.attributeValueClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalAttributeValue):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.attributeValueClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalAttributeValue>):Promise<SearchResult<LocalAttributeValue>> {
        return this.attributeValueClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsAttributeValue>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalAttributeValue>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    fromLocalConverter(localAttributeValue:LocalAttributeValue):WsAttributeValue {
        var attrValue = new WsAttributeValue();
        attrValue.id = localAttributeValue.id;
        attrValue.value = localAttributeValue.value;
        if (localAttributeValue.attributeDefinition != null) {
            attrValue.attributeDefinitionRef = new WsAttributeDefinitionRef(localAttributeValue.attributeDefinition.id);
        }
        return attrValue;
    }

    toLocalConverter(attributeValue:WsAttributeValue):Promise<LocalAttributeValue> {
        var localValueDesc:any = {};
        localValueDesc.id = attributeValue.id;
        localValueDesc.value = attributeValue.value;

        var taskList = [];
        var definitionRef = attributeValue.attributeDefinitionRef;

        taskList.push(
            this.attributeDefinitionService.get(definitionRef.id)
                .then((definition)=> {
                    localValueDesc.attributeDefinition = definition;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return LocalAttributeValueFactory.createAttributeValue(localValueDesc);
            });
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}