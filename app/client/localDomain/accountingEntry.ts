/**
 * Created by cghislai on 02/09/15.
 */

import {AccountingEntry, AccountingEntryRef, AccountingEntryClient, AccountingEntryFactory} from '../domain/accountingEntry';
import {AccountingTransactionRef, AccountingTransaction, AccountingTransactionClient, AccountingTransactionFactory} from '../domain/accountingTransaction';
import {AccountClient, AccountRef} from '../domain/account';
import {Company, CompanyRef, CompanyClient, CompanyFactory} from '../domain/company';
import {CustomerRef, Customer,CustomerClient, CustomerFactory} from '../domain/customer';

import {LocalAccount, LocalAccountFactory} from './account';
import {LocalCompany, LocalCompanyFactory} from './company';

import {LocaleTexts, LocaleTextsFactory} from '../utils/lang';
import {ComptoirRequest} from '../utils/request';

import * as Immutable from 'immutable';

export interface LocalAccountingEntry extends Immutable.Map<string, any> {
    id:number;
    company:LocalCompany;
    amount:number;
    vatRate:number;
    dateTime:Date;
    description:LocaleTexts;
    accountingTransactionRef:AccountingTransactionRef;
    vatAccountingEntry:LocalAccountingEntry;
    customer:Customer;

    account:LocalAccount;
}
var AccountingEntryRecord = Immutable.Record({
    id: null,
    company: null,
    amount: null,
    vatRate: null,
    dateTime: null,
    description: null,
    accountingTransactionRef: null,
    vatAccountingEntry: null,
    customer: null,
    account: null
});
export function NewAccountingEntry(desc: any) : LocalAccountingEntry {
    return <any>AccountingEntryRecord(desc);
}

export class LocalAccountingEntryFactory {
    static accountClient = new AccountClient();
    static companyClient = new CompanyClient();
    static customerClient = new CustomerClient();
    static entryClient = new AccountingEntryClient();

    static toLocalAccountingEntry(accountingEntry:AccountingEntry, authToken:string):Promise<LocalAccountingEntry> {
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
            LocalAccountingEntryFactory.accountClient.getFromCacheOrServer(accountId, authToken)
                .then((account)=> {
                    return LocalAccountFactory.toLocalAccount(account, authToken);
                })
                .then((localAccount:LocalAccount)=> {
                    localAccountingEntryDesc.account = localAccount;
                })
        );
        var companyRef = accountingEntry.companyRef;
        var companyId = companyRef.id;
        taskList.push(
            LocalAccountingEntryFactory.companyClient.getFromCacheOrServer(companyId, authToken)
                .then((company)=> {
                    return LocalCompanyFactory.toLocalCompany(company, authToken);
                }).then((localCompany:LocalCompany)=> {
                    localAccountingEntryDesc.company = localCompany;
                })
        );
        var customerRef = accountingEntry.customerRef;
        if (customerRef !== null) {
            var customerId = customerRef.id;
            taskList.push(
                LocalAccountingEntryFactory.customerClient.getFromCacheOrServer(customerId, authToken)
                    .then((customer)=> {
                        localAccountingEntryDesc.customer = customer;
                    })
            );
        }
        var vatAccountingEntryRef = accountingEntry.vatAccountingEntryRef;
        if (vatAccountingEntryRef !== null) {
            var vatEntryId = vatAccountingEntryRef.id;
            taskList.push(
                LocalAccountingEntryFactory.entryClient.getFromCacheOrServer(vatEntryId, authToken)
                    .then((entry:AccountingEntry)=> {
                        return LocalAccountingEntryFactory.toLocalAccountingEntry(entry, authToken);
                    }).then((localEntry:LocalAccountingEntry)=> {
                        localAccountingEntryDesc.vatAccountingEntry = localEntry;
                    })
            );
        }

        return Promise.all(taskList)
            .then(()=> {
                return NewAccountingEntry(localAccountingEntryDesc);
            });
    }

    static fromLocalAccountingEntry(localAccountingEntry:LocalAccountingEntry) {
        var accountingEntry = new AccountingEntry();
        accountingEntry.accountingTransactionRef = localAccountingEntry.accountingTransactionRef;
        accountingEntry.accountRef = new AccountRef(localAccountingEntry.account.id);
        accountingEntry.amount = localAccountingEntry.amount;
        accountingEntry.companyRef = new CompanyRef(localAccountingEntry.company.id);
        if (localAccountingEntry.customer !== null) {
            accountingEntry.customerRef = new CustomerRef(localAccountingEntry.customer.id);
        }
        accountingEntry.dateTime = localAccountingEntry.dateTime;
        accountingEntry.description = localAccountingEntry.description;
        accountingEntry.id = localAccountingEntry.id;
        if (localAccountingEntry.vatAccountingEntry !== null) {
            accountingEntry.vatAccountingEntryRef = new AccountingEntryRef(localAccountingEntry.vatAccountingEntry.id);
        }
        accountingEntry.vatRate = localAccountingEntry.vatRate;
        return accountingEntry;
    }

}