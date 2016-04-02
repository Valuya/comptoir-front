/**
 * Created by cghislai on 05/08/15.
 */

export class WsLocaleText {
    locale:  string;
    text: string;
}

export class WsLocaleTextFactory {

    static fromJSONLocaleTextReviver = (key, value)=>{
        return value;
    }
}