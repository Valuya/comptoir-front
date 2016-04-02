/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from "angular2/core";
import {WsBalance, WsBalanceRef} from "../client/domain/accounting/balance";
import {WsAccountRef} from "../client/domain/accounting/account";
import {Balance, BalanceFactory} from "../domain/accounting/balance";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {WsUtils} from "../client/utils/wsClient";
import {BalanceClient} from "../client/client/balance";
import {AuthService} from "./auth";
import {AccountService} from "./account";
import {ApplicationRequestCache} from "../client/utils/applicationRequestCache";

@Injectable()
export class BalanceService {

    balanceClient:BalanceClient;
    authService:AuthService;
    accountService:AccountService;

    constructor(balanceClient:BalanceClient,
                authService:AuthService,
                accountService:AccountService) {
        this.balanceClient = balanceClient;
        this.authService = authService;
        this.accountService = accountService;
    }

    fetch(id:number):Promise<Balance> {
        return this.balanceClient.doFetch(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsBalance)=> {
                return this.toLocalConverter(entity);
            });
    }

    get(id:number):Promise<Balance> {
        return this.balanceClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsBalance)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.balanceClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:Balance):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.balanceClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<Balance>):Promise<SearchResult<Balance>> {
        return this.balanceClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsBalance>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<Balance>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    closeBalance(localBalance:Balance):Promise<WsBalanceRef> {
        var url = this.balanceClient.webServiceUrl + this.balanceClient.resourcePath + '/' + localBalance.id;
        url += "/state/CLOSED";
        var options = WsUtils.getRequestOptions(this.getAuthToken());
        options.url = url;
        options.method = 'PUT';

        var request = this.balanceClient.http.request(url, options);
        request = ApplicationRequestCache.registerRequest(request);

        return request
            .map((response)=> {
                return <WsBalanceRef>response.json();
            })
            .toPromise();
    }


    toLocalConverter(balance:WsBalance):Promise<Balance> {
        var localBalanceDesc:any = {};
        localBalanceDesc.id = balance.id;
        localBalanceDesc.balance = balance.balance;
        localBalanceDesc.closed = balance.closed;
        localBalanceDesc.comment = balance.comment;
        localBalanceDesc.dateTime = balance.dateTime;

        var taskList = [];
        var accountRef = balance.accountRef;

        taskList.push(
            this.accountService.get(accountRef.id)
                .then((account)=> {
                    localBalanceDesc.account = account;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                return BalanceFactory.createNewBalance(localBalanceDesc);
            });
    }

    fromLocalConverter(localBalance:Balance):WsBalance {
        var balance = new WsBalance();
        balance.accountRef = new WsAccountRef(localBalance.account.id);
        balance.balance = localBalance.balance;
        balance.closed = localBalance.closed;
        balance.comment = localBalance.comment;
        balance.dateTime = localBalance.dateTime;
        balance.id = localBalance.id;
        return balance;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}