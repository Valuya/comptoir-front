/**
 * Created by cghislai on 02/09/15.
 */

import {WsCompanyRef} from "./../company/company";
import {WsRef} from "../util/ref";


export class WsPicture {
    id:number;
    companyRef: WsCompanyRef;
    data:string;
    contentType:string;
}

export class WsPictureRef extends WsRef<WsPicture> {
}


export class WsPictureFactory {
    static fromJSONReviver = (key, value)=> {
        return value;
    }
    static toJSONReplacer = (key, value)=> {
        return value;
    }


}