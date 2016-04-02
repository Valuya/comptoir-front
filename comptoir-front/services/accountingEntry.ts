/**
 * Created by cghislai on 29/07/15.
 */
import {Injectable} from "angular2/core";
import {AccountingEntry, AccountingEntryFactory} from "../domain/accounting/accountingEntry";
import {Account} from "../domain/accounting/account";
import {WithId} from "../client/utils/withId";
import {SearchRequest, SearchResult} from "../client/utils/search";
import {AccountingEntryClient} from "../client/client/accountingEntry";
import {AuthService} from "./auth";
import {AccountService} from "./account";
import {CompanyService} from "./company";
import {CustomerService} from "./customer";
import {WsAccountingEntry, WsAccountingEntryRef} from "../client/domain/accounting/accountingEntry";
import {WsAccountRef} from "../client/domain/accounting/account";
import {WsCompanyRef} from "../client/domain/company/company";
import {WsCustomerRef} from "../client/domain/thirdparty/customer";

@Injectable()
export class AccountingEntryService {


    accountingEntryClient:AccountingEntryClient;
    authService:AuthService;
    accountService:AccountService;
    companyService:CompanyService;
    customerService:CustomerService;

    constructor(accountingEntryClient:AccountingEntryClient,
                authService:AuthService,
                accountService:AccountService,
                companyService:CompanyService,
                customerService:CustomerService) {
        this.accountingEntryClient = accountingEntryClient;
        this.authService = authService;
        this.accountService = accountService;
        this.companyService = companyService;
        this.customerService = customerService;
    }

    get(id:number):Promise<AccountingEntry> {
        return this.accountingEntryClient.doGet(id, this.getAuthToken())
            .toPromise()
            .then((entity:WsAccountingEntry)=> {
                return this.toLocalConverter(entity);
            });
    }

    remove(id:number):Promise<any> {
        return this.accountingEntryClient.doRemove(id, this.getAuthToken())
            .toPromise();
    }

    save(entity:AccountingEntry):Promise<WithId> {
        var e = this.fromLocalConverter(entity);
        return this.accountingEntryClient.doSave(e, this.getAuthToken())
            .toPromise();
    }

    search(searchRequest:SearchRequest<AccountingEntry>):Promise<SearchResult<AccountingEntry>> {
        return this.accountingEntryClient.doSearch(searchRequest, this.getAuthToken())
            .toPromise()
            .then((result:SearchResult<WsAccountingEntry>)=> {
                var taskList = [];
                result.list.forEach((entity)=> {
                    taskList.push(
                        this.toLocalConverter(entity)
                    );
                });
                return Promise.all(taskList)
                    .then((results)=> {
                        var localResult = new SearchResult<AccountingEntry>();
                        localResult.count = result.count;
                        localResult.list = Immutable.List(results);
                        return localResult;
                    });
            });
    }

    toLocalConverter(accountingEntry:WsAccountingEntry):Promise<AccountingEntry> {
        var localAccountingEntryDesc:any = {};
        localAccountingEntryDesc.amount = accountingEntry.amount;
        localAccountingEntryDesc.dateTime = accountingEntry.dateTime;
        localAccountingEntryDesc.description = accountingEntry.description;
        localAccountingEntryDesc.id = accountingEntry.id;
        localAccountingEntryDesc.vatRate = accountingEntry.vatRate;
        localAccountingEntryDesc.accountingTransactionRef = accountingEntry.accountingTransactionRef;

        var taskList = [];

        var accountRef = accountingEntry.accountRef;
        var accountId = accountRef.id;

        taskList.push(
            this.accountService.get(accountId)
                .then((localAccount:Account)=> {
                    localAccountingEntryDesc.account = localAccount;
                })
        );
        var companyRef = accountingEntry.companyRef;
        var companyId = companyRef.id;
        taskList.push(
            this.companyService.get(companyId, this.getAuthToken())
                .then((company)=> {
                    localAccountingEntryDesc.company = company;
                })
        );
        var customerRef = accountingEntry.customerRef;
        if (customerRef != null) {
            var customerId = customerRef.id;
            taskList.push(
                this.customerService.get(customerId)
                    .then((customer)=> {
                        localAccountingEntryDesc.customer = customer;
                    })
            );
        }
        var vatAccountingEntryRef = accountingEntry.vatAccountingEntryRef;
        if (vatAccountingEntryRef != null) {
            var vatEntryId = vatAccountingEntryRef.id;
            taskList.push(
                this.get(vatEntryId)
                    .then((localEntry:AccountingEntry)=> {
                        localAccountingEntryDesc.vatAccountingEntry = localEntry;
                    })
            );
        }

        return Promise.all(taskList)
            .then(()=> {
                return AccountingEntryFactory.createAccountingEntry(localAccountingEntryDesc);
            });
    }

    fromLocalConverter(localAccountingEntry:AccountingEntry):WsAccountingEntry {
        var accountingEntry = new WsAccountingEntry();
        accountingEntry.accountingTransactionRef = localAccountingEntry.accountingTransactionRef;
        accountingEntry.accountRef = new WsAccountRef(localAccountingEntry.account.id);
        accountingEntry.amount = localAccountingEntry.amount;
        accountingEntry.companyRef = new WsCompanyRef(localAccountingEntry.company.id);
        if (localAccountingEntry.customer != null) {
            accountingEntry.customerRef = new WsCustomerRef(localAccountingEntry.customer.id);
        }
        accountingEntry.dateTime = localAccountingEntry.dateTime;
        accountingEntry.description = localAccountingEntry.description;
        accountingEntry.id = localAccountingEntry.id;
        if (localAccountingEntry.vatAccountingEntry != null) {
            accountingEntry.vatAccountingEntryRef = new WsAccountingEntryRef(localAccountingEntry.vatAccountingEntry.id);
        }
        accountingEntry.vatRate = localAccountingEntry.vatRate;
        return accountingEntry;
    }

    private getAuthToken():string {
        return this.authService.authToken;
    }
}