import {WsCompanyRef} from "../company/company";
import {WsAccountingTransactionRef} from "../accounting/accountingTransaction";
import {WsAccountSearch} from "./accountSearch";
/**
 * Created by cghislai on 02/04/16.
 */

export class WsAccountingEntrySearch {
    companyRef:WsCompanyRef;
    accountingTransactionRef:WsAccountingTransactionRef;
    accountSearch:WsAccountSearch;
    fromDateTime:Date;
    toDateTime:Date;
}