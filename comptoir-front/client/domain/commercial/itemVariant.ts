/**
 * Created by cghislai on 07/08/15.
 */

import {WsAttributeValueRef} from "./attributeValue";
import {WsPictureRef} from "./picture";
import {Pricing} from "../util/pricing";
import {WsItemRef} from "./item";
import {WsRef} from "../util/ref";


export class WsItemVariant {
    id:number;
    itemRef:WsItemRef;
    variantReference:string;

    pricing:Pricing;
    pricingAmount:number;

    attributeValueRefs:WsAttributeValueRef[];

    mainPictureRef:WsPictureRef;
}

export class WsItemVariantRef extends WsRef<WsItemVariant> {
}


export class WsItemVariantFactory {

    static fromJSONReviver = (key, value)=> {
        switch (key) {
            case 'pricing':
                return Pricing[value];
        }
        return value;
    };

    static toJSONReplacer = (key, value)=> {
        switch (key) {
            case 'pricing':
                return Pricing[value];
        }
        return value;
    };

}
