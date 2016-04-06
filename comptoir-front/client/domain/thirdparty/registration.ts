import {WsCompany, WsCompanyFactory} from "../company/company";
import {WsEmployee, WsEmployeeFactory} from "./employee";
import {LocaleTextsFactory} from "../../utils/lang";
/**
 * Created by cghislai on 02/04/16.
 */

export class WsRegistration {
    company:WsCompany;
    employee:WsEmployee;
    employeePassword:string;
}

export class WsRegistrationFactory {

    public static toJSONReplacer = (key, value)=>{
        switch (key) {
            // FIXME: company description
            case 'description':
            case 'name':
                return LocaleTextsFactory.toJSONArrayLocaleTextsTransformer(value);
        }
        return value;
    };
}
