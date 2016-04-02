/**
 * Created by cghislai on 08/09/15.
 */

import {Employee} from "./../thirdparty/employee";
import * as Immutable from "immutable";

export interface Auth extends Immutable.Map<string, any> {
    id: number;
    employee:Employee;
    token:string;
    refreshToken: string;
    expirationDateTime: Date;
}
var AuthRecord = Immutable.Record({
    id: null,
    employee: null,
    token: null,
    refreshToken: null,
    expirationDateTime: null
});

export class AuthFactory {

    static createNewAuth(desc:any):Auth {
        return <any>AuthRecord(desc);
    }
}