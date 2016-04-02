/**
 * Created by cghislai on 15/01/16.
 */


import {AccountClient} from './client/account';
import {AccountingEntryClient} from './client/accountingEntry';
import {AccountingTransactionClient} from './client/accountingTransaction';
import {AttributeDefinitionClient} from './client/attributeDefinition';
import {AttributeValueClient} from './client/attributeValue';
import {AuthClient} from './client/auth';
import {BalanceClient} from './client/balance';
import {CompanyClient} from './client/company';
import {CountryClient} from './client/country';
import {CustomerClient} from './client/customer';
import {EmployeeClient} from './client/employee';
import {InvoiceClient} from './client/invoice';
import {ItemClient} from './client/item';
import {ItemVariantClient} from './client/itemVariant';
import {ItemVariantSaleClient} from './client/itemVariantSale';
import {MoneyPileClient} from './client/moneyPile';
import {PictureClient} from './client/picture';
import {PosClient} from './client/pos';
import {SaleClient} from './client/sale';
import {StockClient} from './client/stock';
import {ItemVariantStockClient} from "./client/itemVariantStock";

export const CLIENT_PROVIDERS = [
    AccountClient,
    AccountingEntryClient,
    AccountingTransactionClient,
    AttributeDefinitionClient,
    AttributeValueClient,
    AuthClient,
    BalanceClient,
    CompanyClient,
    CountryClient,
    CustomerClient,
    EmployeeClient,
    InvoiceClient,
    ItemClient,
    ItemVariantClient,
    ItemVariantSaleClient,
    ItemVariantStockClient,
    MoneyPileClient,
    PictureClient,
    PosClient,
    SaleClient,
    StockClient
];