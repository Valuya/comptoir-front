import {WsRef} from "../util/ref";
/**
 * Created by cghislai on 14/08/15.
 */

export class WsPrice {
    id: number;
    startDateTime: Date;
    endDateTime: Date;
    vatExclusive: number;
    vatRate: number;
}

export class WsPriceRef extends WsRef<WsPrice> {
}

export class WsPriceFactory {
    static fromJSONPriceReviver = (key, value)=>{
        switch (key) {
            case 'startDateTime':
            case 'endDateTime':
                return new Date(value);
        }
        return value;
    }
}