import {WsCompanyRef} from "../company/company";
import {WsItemVariantRef} from "../commercial/itemVariant";
import {WsStockRef} from "../stock/stock";
/**
 * Created by cghislai on 02/04/16.
 */

export class WsItemVariantStockSearch {
    companyRef:WsCompanyRef;
    itemVariantRef:WsItemVariantRef;
    stockRef:WsStockRef;
    atDateTime:Date;
}