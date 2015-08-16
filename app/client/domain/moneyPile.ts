/**
 * Created by cghislai on 16/08/15.
 */

import {AccountRef} from 'client/domain/account';
import {BalanceRef} from 'client/domain/balance';

export class MoneyPile {
    id: number;
    accountRef: AccountRef;
    dateTime: Date;
    unitAmount: number;
    count: number;
    total: number;
    balanceRef: BalanceRef;
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
    static fromJSONMoneyPileReviver=(key,value)=>{
        if (key == 'dateTime') {
            var date = new Date(value);
            return date;
        }
    };
}