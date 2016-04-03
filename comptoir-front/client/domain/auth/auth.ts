/**
 * Created by cghislai on 07/08/15.
 */

import {WsEmployeeRef} from "./../thirdparty/employee";

export class WsAuth {
    id: number;
    employeeRef:WsEmployeeRef;
    token:string;
    refreshToken: string;
    expirationDateTime: Date;
}

export class WsAuthFactory {
    static fromJSONReviver = (key, value)=> {
        switch (key) {
            case 'expirationDateTime':
                return new Date(value);
        }
        return value;
    };
    static toJSONReplacer = (key, value)=> {
        switch (key) {
            case 'expirationDateTime':
                return value;
        }
        return value;
    };

}