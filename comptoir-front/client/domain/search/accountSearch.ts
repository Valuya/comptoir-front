import {WsCompanyRef} from "../company/company";
import {WsPosRef} from "../commercial/pos";
/**
 * Created by cghislai on 02/04/16.
 */

export class WsAccountSearch {
    companyRef:WsCompanyRef;
    posRef:WsPosRef;
    type:string;
    cash:boolean;
}
