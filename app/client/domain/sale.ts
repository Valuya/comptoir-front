/**
 * Created by cghislai on 14/08/15.
 */

import {CompanyRef} from 'client/domain/company';
import {CustomerRef} from 'client/domain/customer';
import {InvoiceRef} from 'client/domain/invoice';
import {AccountingTransactionRef} from 'client/domain/accountingTransaction'
export class Sale {
    id: number;
    companyRef: CompanyRef;
    customerRef: CustomerRef;
    dateTime: Date;
    invoiceRef: InvoiceRef;
    vatExclusiveAmount: number;
    vatAmount: number;
    closed: boolean;
    reference: string;
    accountingTransactionRef: AccountingTransactionRef;
}

export class SaleRef {
    id: number;
    link: string;
}

export class SaleSearch {
    companyRef: CompanyRef;
}

export class SaleFactory {
    static fromJSONSaleReviver = (key, value)=> {
       return value;
    }
}