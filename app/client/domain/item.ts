/**
 * Created by cghislai on 07/08/15.
 */
import {LocaleText, LocaleTextFactory} from 'client/domain/lang';
import {CompanyRef, CompanyFactory} from 'client/domain/company';
import {ItemPictureRef, ItemPictureFactory} from 'client/domain/itemPicture';
import {Pagination} from 'client/utils/pagination';

export class ItemRef {
    id:number;
    link:string;
}

export class Item {
    id:number;
    companyRef:CompanyRef;
    mainPictureRef:ItemPictureRef;
    reference:string;
    model:string;
    name:LocaleText;
    description:LocaleText;
    vatExclusive:number;
    vatRate:number;
}

export class ItemSearch {
    pagination:Pagination;
    companyId:number;
    multiSearch:string;
    nameContains:string;
    descriptionContains:string;
    reference:string;
    referenceContains:string;
    model:string;
}

export class ItemFactory {
    static buildItemRefFromJSON(jsonObject:any):ItemRef {
        var itemRef = new ItemRef();
        itemRef.id = jsonObject.id;
        itemRef.link = jsonObject.link;
        return itemRef;
    }

    static buildItemFromJSON(jsonObject:any):Item {
        var item = new Item();
        item.id = jsonObject.id;
        item.companyRef = CompanyFactory.getCompanyRefFromJSON(jsonObject.companyRef);
        item.mainPictureRef = ItemPictureFactory.buildItemPictureRefFromJSON(jsonObject.companyref);
        item.reference = jsonObject.reference;
        item.model = jsonObject.model;
        item.name = LocaleTextFactory.getLocaleTextFromJSON(jsonObject.name);
        item.description = LocaleTextFactory.getLocaleTextFromJSON(jsonObject.description);
        item.vatExclusive = jsonObject.vatExclusive;
        item.vatRate = jsonObject.vatRate;
        return item;
    }
}