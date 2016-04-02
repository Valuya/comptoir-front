/**
 * Created by cghislai on 08/09/15.
 */

import {AttributeDefinition} from "./attributeDefinition";
import * as Immutable from "immutable";
import {LocaleTexts} from "../../client/utils/lang";

export interface AttributeValue extends Immutable.Map<string, any> {
    id:number;
    value:LocaleTexts;

    attributeDefinition:AttributeDefinition;
}
var AttributeValueRecord = Immutable.Record({
    id: null,
    value: null,
    attributeDefinition: null
});

export class AttributeValueFactory {

    static createAttributeValue(desc:any):AttributeValue {
        return <any>AttributeValueRecord(desc);
    }
}