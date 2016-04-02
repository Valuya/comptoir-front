import {WsCompanyRef} from "../company/company";
/**
 * Created by cghislai on 02/04/16.
 */


export class WsItemSearch {
    companyRef: WsCompanyRef;
    multiSearch:string;
    nameContains:string;
    descriptionContains:string;
    reference:string;
    referenceContains:string;
    locale: string;
    multipleSale: boolean;
}
