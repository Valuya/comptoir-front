import {WsItemSearch} from "./itemSearch";
import {WsItemRef} from "../commercial/item";
/**
 * Created by cghislai on 02/04/16.
 */


export class WsItemVariantSearch {
    itemSearch:WsItemSearch;
    itemRef:WsItemRef;
    variantReference:string;
    variantReferenceContains:string;
}