/**
 * Created by cghislai on 14/08/15.
 */

import {LocalCompany} from './company';


export interface LocalCustomer extends Immutable.Map<string, any> {
    id: number;
    company:LocalCompany;
    firstName:string;
    lastName:string;
    address1:string;
    address2:string;
    zip:string;
    city:string;
    phone1:string;
    phone2:string;
    email:string;
    notes:string;
    
    loyaltyBalance: number;
}
var CustomerRecord = Immutable.Record({
    id: null,
    company: null,
    firstName: null,
    lastName: null,
    address1: null,
    address2: null,
    zip: null,
    city: null,
    phone1: null,
    phone2: null,
    email: null,
    notes: null,

    loyaltyBalance: null
});

export class LocalCustomerFactory {

    static createNewCustomer(desc:any):LocalCustomer {
        return <any>CustomerRecord(desc);
    }
}
