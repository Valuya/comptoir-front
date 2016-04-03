import {WsCompany} from "../company/company";
import {WsEmployee} from "./employee";
/**
 * Created by cghislai on 02/04/16.
 */

export class WsRegistration {
    company:WsCompany;
    employee:WsEmployee;
    employeePassword:string;
}

export class WsRegistrationFactory {
    public static fronJSONReviver = (key, value)=>{
        return value;
    };
    public static toJSONReviver = (key, value)=>{
        return value;
    };
}
