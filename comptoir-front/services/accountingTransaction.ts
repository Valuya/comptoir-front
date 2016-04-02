/**
 * Created by cghislai on 29/07/15.
 */
import {Injectable} from "angular2/core";
import {WsAccountingTransaction} from "../client/domain/accounting/accountingTransaction";
import {WsCompanyRef} from "../client/domain/company/company";
import {
    AccountingTransaction,
    AccountingTransactionFactory
} from "../domain/accounting/accountingTransaction";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {AccountingTransactionClient} from "../client/client/accountingTransaction";
import {AuthService} from "./auth";
import {CompanyService} from "./company";

@Injectable()
export class AccountingTransactionService {

    accountingTransactionClient:AccountingTransactionClient;
    authService:AuthService;
    companyService:CompanyService;

    constructor(accountingTransactionClient:AccountingTransactionClient,
                authService:AuthService,
                companyService:CompanyService) {
        this.accountingTransactionClient = accountingTransactionClient;
        this.authService = authService;
        this.companyService = companyService;
    }

    get(id:number):Promise<AccountingTransaction> {
        return this.accountingTransactionClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsAccountingTransaction)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.accountingTransactionClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:AccountingTransaction):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.accountingTransactionClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<AccountingTransaction>):Promise<SearchResult<AccountingTransaction>> {
        return this.accountingTransactionClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsAccountingTransaction>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<AccountingTransaction>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    fromLocalConverter(localAccountingTransaction:AccountingTransaction):WsAccountingTransaction {
        var accountingTransaction = new WsAccountingTransaction();
        accountingTransaction.accountingTransactionType = localAccountingTransaction.accountingTransactionType;
        if (localAccountingTransaction.company != null) {
            accountingTransaction.companyRef = new WsCompanyRef(localAccountingTransaction.company.id);
        }
        accountingTransaction.dateTime = localAccountingTransaction.dateTime;
        accountingTransaction.id = localAccountingTransaction.id;
        return accountingTransaction;
    }

    toLocalConverter(accountingTransaction:WsAccountingTransaction):Promise<AccountingTransaction> {
        var localAccountingTransactionDesc:any = {};
        localAccountingTransactionDesc.id = accountingTransaction.id;
        localAccountingTransactionDesc.dateTime = accountingTransaction.dateTime;
        localAccountingTransactionDesc.accountingTransactionType = accountingTransaction.accountingTransactionType;

        var taskList = [];

        var companyRef = accountingTransaction.companyRef;
        var companyId = companyRef.id;

        taskList.push(
            this.companyService.get(companyId, this.getAuthToken())
                .then((company)=> {
                    localAccountingTransactionDesc.company = company;
                })
        );

        return Promise.all(taskList)
            .then(()=> {
                return AccountingTransactionFactory.createAccountingTransaction(localAccountingTransactionDesc);
            });
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}