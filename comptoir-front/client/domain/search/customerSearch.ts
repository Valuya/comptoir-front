import {WsCompanyRef} from "../company/company";
/**
 * Created by cghislai on 02/04/16.
 */

export class WsCustomerSearch {
    companyRef:WsCompanyRef;
    multiSearch: string;
    lastNameContains: string;
    firstNameContains: string;
    cityContains: string;
    emailContains: string;
    notesContains: string;
}