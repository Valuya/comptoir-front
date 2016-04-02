import {WsCompanyRef} from "../company/company";
import {WsAccountRef} from "../accounting/account";
import {WsAccountSearch} from "./accountSearch";
/**
 * Created by cghislai on 02/04/16.
 */

export class WsBalanceSearch {
    companyRef: WsCompanyRef;
    accountRef: WsAccountRef;
    accountSearch: WsAccountSearch;
    fromDateTime: Date;
    toDateTime : Date;
    closed: boolean;
}