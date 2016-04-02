/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from 'angular2/core';

import {WsCompanyRef} from '../client/domain/company/company';
import {WsCustomerRef} from '../client/domain/thirdparty/customer';

import {Pos, PosFactory} from '../domain/commercial/pos';

import {WithId} from '../client/utils/withId';
import {SearchRequest, SearchResult} from '../client/utils/search';

import {PosClient} from '../client/client/pos';

import {AuthService} from './auth';
import {CompanyService} from './company';
import {CustomerService} from './customer';
import {WsPos} from "../client/domain/commercial/pos";

@Injectable()
export class PosService {


    lastUsedPos:Pos;
    private posClient:PosClient;
    private authService:AuthService;
    private companyService:CompanyService;
    private customerService:CustomerService;

    constructor(posClient:PosClient,
                authService:AuthService,
                companyService:CompanyService,
                customerService:CustomerService) {
        this.posClient = posClient;
        this.authService = authService;
        this.companyService = companyService;
        this.customerService = customerService;

    }

    get(id:number):Promise<Pos> {
        return  this.posClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsPos)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return  this.posClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:Pos):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return  this.posClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<Pos>):Promise<SearchResult<Pos>> {
        return  this.posClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsPos>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<Pos>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(pos:WsPos):Promise<Pos> {
        var localPosDesc:any = {};
        localPosDesc.description = pos.description;
        localPosDesc.id = pos.id;
        localPosDesc.name = pos.name;

        var taskList = [];
        var companyRef = pos.companyRef;


        taskList.push(
            this.companyService.get(companyRef.id, this.getAuthToken())
                .then((localCompany)=> {
                    localPosDesc.company = localCompany;
                })
        );
        var defaultCustomerRef = pos.defaultCustomerRef;
        if (defaultCustomerRef != null) {
            taskList.push(
                this.customerService.get(defaultCustomerRef.id)
                    .then((localCompany)=> {
                        localPosDesc.defaultCustomer = localCompany;
                    })
            );
        }
        return Promise.all(taskList)
            .then(()=> {
                return PosFactory.createNewPos(localPosDesc);
            });
    }

    fromLocalConverter(localPos:Pos):WsPos {
        var pos = new WsPos();
        pos.id = localPos.id;
        pos.companyRef = new WsCompanyRef(localPos.company.id);
        if (localPos.defaultCustomer != null) {
            pos.defaultCustomerRef = new WsCustomerRef(localPos.defaultCustomer.id);
        }
        pos.description = localPos.description;
        pos.name = localPos.name;
        return pos;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}