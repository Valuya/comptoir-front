/**
 * Created by cghislai on 16/08/15.
 */

import {WsAccountRef} from "./account";
import {WsRef} from "../util/ref";

export class WsBalance {
    id:number;
    accountRef:WsAccountRef;
    dateTime:Date;
    balance:number;
    comment:string;
    closed:boolean;
}

export class WsBalanceRef extends WsRef<WsBalance> {
}


export class WsBalanceFactory {
    static fromJSONReviver = (key, value)=> {
        switch (key) {
            case 'dateTime':
                return new Date(value);
        }
        return value;
    };

    static toJSONReplacer = (key, value)=> {
        switch (key) {
            case 'dateTime':
                return value;
        }
        return value;
    };

}