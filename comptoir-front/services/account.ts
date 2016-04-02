/**
 * Created by cghislai on 06/08/15.
 */
import {Injectable} from "angular2/core";
import {LocalAccount, LocalAccountFactory} from "../domain/account";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {AccountClient} from "../client/client/account";
import {AuthService} from "./auth";
import {CompanyService} from "./company";
import {WsAccount} from "../client/domain/accounting/account";
import {AccountType} from "../client/domain/util/accountType";
import {WsCompanyRef} from "../client/domain/company/company";

@Injectable()
export class AccountService {
    accountClient:AccountClient;
    authService:AuthService;
    companyService:CompanyService;

    lastUsedBalanceAccount:LocalAccount;

    constructor(accountClient:AccountClient,
                authService:AuthService,
                companyService:CompanyService) {
        this.accountClient = accountClient;
        this.authService = authService;
        this.companyService = companyService;

    }

    get(id:number):Promise<LocalAccount> {
        return this.accountClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsAccount)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.accountClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:LocalAccount):Promise<WithId> {
        var e:WsAccount = this.fromLocalConverter(entity);
        return this.accountClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<LocalAccount>):Promise<SearchResult<LocalAccount>> {
        return this.accountClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsAccount>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<LocalAccount>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    fromLocalConverter(localAccount:LocalAccount):WsAccount {
        var account = new WsAccount();
        account.accountingNumber = localAccount.accountingNumber;
        account.accountType = localAccount.accountType;
        account.bic = localAccount.bic;
        account.companyRef = new WsCompanyRef(localAccount.company.id);
        account.description = localAccount.description;
        account.iban = localAccount.iban;
        account.id = localAccount.id;
        account.name = localAccount.name;
        account.cash = localAccount.cash;
        return account;
    }

    toLocalConverter(account:WsAccount):Promise<LocalAccount> {
        var localAccountDesc:any = {};
        localAccountDesc.accountingNumber = account.accountingNumber;
        localAccountDesc.accountType = AccountType[account.accountType];
        localAccountDesc.accountTypeLabel = LocalAccountFactory.getAccountTypeLabel(localAccountDesc.accountType);
        localAccountDesc.bic = account.bic;
        localAccountDesc.description = account.description;
        localAccountDesc.iban = account.iban;
        localAccountDesc.id = account.id;
        localAccountDesc.name = account.name;
        localAccountDesc.cash = account.cash;

        var taskList = [];

        var companyRef = account.companyRef;
        var companyId = companyRef.id;

        taskList.push(
            this.companyService.get(companyId, this.getAuthToken())
                .then((company)=> {
                    localAccountDesc.company = company;
                })
        );
        return Promise.all(taskList)
            .then(()=> {
                var localAccount:LocalAccount = LocalAccountFactory.createNewAccount(localAccountDesc);
                return localAccount;
            });
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }


}