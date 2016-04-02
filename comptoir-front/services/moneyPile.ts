/**
 * Created by cghislai on 29/07/15.
 */
import {Injectable} from "angular2/core";
import {WsMoneyPile} from "../client/domain/cash/moneyPile";
import {WsAccountRef} from "../client/domain/accounting/account";
import {WsBalanceRef} from "../client/domain/accounting/balance";
import {MoneyPile, MoneyPileFactory} from "../domain/cash/moneyPile";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {MoneyPileClient} from "../client/client/moneyPile";
import {AuthService} from "./auth";
import {AccountService} from "./account";
import {BalanceService} from "./balance";


@Injectable()
export class MoneyPileService {
    private moneyPileClient:MoneyPileClient;
    private authService:AuthService;
    private accountService:AccountService;
    private balanceService:BalanceService;


    constructor(moneyPileClient:MoneyPileClient,
                authService:AuthService,
                accountService:AccountService,
                balanceService:BalanceService) {
        this.moneyPileClient = moneyPileClient;
        this.authService = authService;
        this.accountService = accountService;
        this.balanceService = balanceService;
    }

    get(id:number):Promise<MoneyPile> {
        return this.moneyPileClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsMoneyPile)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.moneyPileClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:MoneyPile):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.moneyPileClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<MoneyPile>):Promise<SearchResult<MoneyPile>> {
        return this.moneyPileClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsMoneyPile>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<MoneyPile>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(moneyPile:WsMoneyPile):Promise<MoneyPile> {
        var localMoneyPileDesc:any = {};
        localMoneyPileDesc.unitCount = moneyPile.count;
        localMoneyPileDesc.dateTime = moneyPile.dateTime;
        localMoneyPileDesc.id = moneyPile.id;
        localMoneyPileDesc.total = moneyPile.total;
        localMoneyPileDesc.unitAmount = moneyPile.unitAmount;

        var taskList = [];
        var accountRef = moneyPile.accountRef;


        taskList.push(
            this.accountService.get(accountRef.id)
                .then((localAccount)=> {
                    localMoneyPileDesc.account = localAccount;
                })
        );
        var balanceRef = moneyPile.balanceRef;
        taskList.push(
            this.balanceService.get(balanceRef.id)
                .then((localBalance)=> {
                    localMoneyPileDesc.balance = localBalance;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return MoneyPileFactory.createNewMoneyPile(localMoneyPileDesc);
            });
    }


    fromLocalConverter(localMoneyPile:MoneyPile):WsMoneyPile {
        var moneyPile = new WsMoneyPile();
        moneyPile.accountRef = new WsAccountRef(localMoneyPile.account.id);
        moneyPile.balanceRef = new WsBalanceRef(localMoneyPile.balance.id);
        moneyPile.count = localMoneyPile.unitCount;
        moneyPile.dateTime = localMoneyPile.dateTime;
        moneyPile.id = localMoneyPile.id;
        moneyPile.total = localMoneyPile.total;
        moneyPile.unitAmount = localMoneyPile.unitAmount;
        return moneyPile;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}