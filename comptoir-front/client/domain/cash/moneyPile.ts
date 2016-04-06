/**
 * Created by cghislai on 16/08/15.
 */

import {WsAccountRef} from "./../accounting/account";
import {WsBalanceRef} from "./../accounting/balance";


export class WsMoneyPile {
    id: number;
    accountRef: WsAccountRef;
    dateTime: Date;
    unitAmount: number;
    count: number;
    total: number;
    balanceRef: WsBalanceRef;
}

export class MoneyPileRef {
    id: number;
    link: string;
    constructor(id?:number) {
        this.id = id;
    }
}
export class MoneyPileSearch {

}

export class MoneyPileFactory {
    static fromJSONReviver=(key,value)=>{
        switch (key) {
            case 'dateTime':
            return new Date(value);
        }
        return value;
    };
    static toJSONReplacer=(key,value)=>{
        switch (key) {
            case 'dateTime':
            return value;
        }
        return value;
    };

}