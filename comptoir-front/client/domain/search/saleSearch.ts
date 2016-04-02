import {WsCustomerRef} from "../thirdparty/customer";
import {WsCompanyRef} from "../company/company";
/**
 * Created by cghislai on 02/04/16.
 */

export class WsSaleSearch {
    companyRef:WsCompanyRef;
    closed:boolean;
    toDateTime: Date;
    fromDateTime: Date;
    customerRef: WsCustomerRef;
}