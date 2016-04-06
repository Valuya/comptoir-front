/**
 * Created by cghislai on 14/08/15.
 */

import {WsCompanyRef} from "./../company/company";
import {WsRef} from "../util/ref";

export class WsCustomer {
    id: number;
    companyRef:WsCompanyRef;
    firstName:string;
    lastName:string;
    adress1:string;
    adress2:string;
    zip:string;
    city:string;
    phone1:string;
    phone2:string;
    email:string;
    notes:string;
}

export class WsCustomerRef extends WsRef<WsCustomer> {
}


export class WsCustomerFactory {
    static fromJSONReviver = (key, value)=> {
        return value;
    }
    static toJSONReplacer = (key, value)=> {
        return value;
    }

}