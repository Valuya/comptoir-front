/**
 * Created by cghislai on 25/08/15.
 */

/**
 * TODO: add id?
 */
export class WsCountry {
    code: string;
    defaultVatRate: number;
}

export class WsCountryRef {
    code: string;
    link: string;
    constructor(code?: string) {
        this.code = code;
    }
}

export class WsCountryFactory {
    static fromJSONReviver=(key,value)=>{
        return value;
    };
}