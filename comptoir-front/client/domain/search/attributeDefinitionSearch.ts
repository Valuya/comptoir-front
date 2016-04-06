import {WsCompanyRef} from "../company/company";
/**
 * Created by cghislai on 02/04/16.
 */

export class WsAttributeDefinitionSearch {
    companyRef:WsCompanyRef;
    nameContains:string;
    valueContains:string;
    multiSearch:string;
    locale:string;
}
