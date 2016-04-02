/**
 * Created by cghislai on 08/09/15.
 */


import {LocalCompany} from "./company";
import * as Immutable from "immutable";
import {LocaleTexts} from "../client/utils/lang";

export interface LocalAttributeDefinition extends Immutable.Map<string, any> {
    id:number;
    name: LocaleTexts;
    company: LocalCompany;
}
var AttributeValueRecord = Immutable.Record({
    id: null,
    name: null,
    company: null
});

export class LocalAttributeDefinitionFactory {

    static createAttributeDefinition(desc:any):LocalAttributeDefinition {
        return <LocalAttributeDefinition>AttributeValueRecord(desc);
    }
}