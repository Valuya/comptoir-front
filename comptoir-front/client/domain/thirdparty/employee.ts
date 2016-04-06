/**
 * Created by cghislai on 07/08/15.
 */

import {WsCompanyRef} from "./../company/company";
import {WsRef} from "../util/ref";


export class WsEmployeeRef extends WsRef<WsEmployee> {
}

export class WsEmployee {
    id:number;
    active:boolean;
    companyRef:WsCompanyRef;
    login:string;
    firstName:string;
    lastName:string;
    locale:string;
}

export class WsEmployeeFactory {
    static fromJSONReviver = (key, value)=> {
        return value;
    };
    static toJSONReplacer = (key, value)=> {
        return value;
    };

}