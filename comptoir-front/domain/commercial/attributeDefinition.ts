/**
 * Created by cghislai on 08/09/15.
 */


import {Company} from "./../company/company";
import * as Immutable from "immutable";
import {LocaleTexts} from "../../client/utils/lang";

export interface AttributeDefinition extends Immutable.Map<string, any> {
    id:number;
    name: LocaleTexts;
    company: Company;
}
var AttributeValueRecord = Immutable.Record({
    id: null,
    name: null,
    company: null
});

export class AttributeDefinitionFactory {

    static createAttributeDefinition(desc:any):AttributeDefinition {
        return <AttributeDefinition>AttributeValueRecord(desc);
    }
}