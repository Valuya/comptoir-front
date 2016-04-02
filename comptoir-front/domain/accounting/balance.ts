/**
 * Created by cghislai on 08/09/15.
 */
import {Account} from "./account";
import * as Immutable from "immutable";

export interface Balance extends Immutable.Map<string, any> {
    id:number;
    account:Account;
    dateTime:Date;
    balance:number;
    comment:string;
    closed:boolean;
}
var BalanceRecord = Immutable.Record({
    id: null,
    account: null,
    dateTime: null,
    balance: null,
    comment: null,
    closed: null
});

export class BalanceFactory {

    static createNewBalance(desc:any):Balance {
        return <any>BalanceRecord(desc);
    }

}