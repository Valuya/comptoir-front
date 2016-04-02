/**
 * Created by cghislai on 08/09/15.
 */

import {Company} from "./../company/company";
import * as Immutable from "immutable";

export interface Employee extends Immutable.Map<string, any> {
    id: number;
    active: boolean;
    company: Company;
    login: string;
    firstName: string;
    lastName: string;
    locale: string;
}
var EmployeeRecord = Immutable.Record({
    id: null,
    active: null,
    company: null,
    login: null,
    firstName: null,
    lastName: null,
    locale: null
});
export class EmployeeFactory {

    static createNewEmployee(desc:any):Employee {
        return <any>EmployeeRecord(desc);
    }
}