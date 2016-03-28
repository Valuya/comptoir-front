/**
 * Created by cghislai on 29/07/15.
 */

import {Component, Input, Output, ChangeDetectionStrategy, ViewEncapsulation, EventEmitter} from "angular2/core";
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from "angular2/common";
import {ItemVariantSale} from "../../../client/domain/itemVariantSale";
import {Language, LocaleTexts, LocaleTextsFactory} from "../../../client/utils/lang";
import {AuthService} from "../../../services/auth";
import {FocusableDirective} from "../../utils/focusable";
import * as Immutable from "immutable";
import {LocalItemVariantSale} from "../../../client/localDomain/itemVariantSale";
import {FastInput} from "../../utils/fastInput";
import {NumberUtils} from "../../../client/utils/number";
import {LocalSale} from "../../../client/localDomain/sale";
import {LocalStock} from "../../../client/localDomain/stock";

/****
 * Column component
 */
@Component({
    selector: 'item-variant-sale-column',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/itemVariantSale/list/itemVariantSaleColumn.html',
    styleUrls: ['./components/itemVariantSale/list/itemVariantSaleList.css'],
    directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen, FastInput],
    encapsulation: ViewEncapsulation.None
})
export class ItemVariantSaleColumnComponent {
    @Output()
    action = new EventEmitter();
    @Input()
    itemVariantSale:LocalItemVariantSale;
    @Input()
    column:ItemVariantSaleColumn;
    @Input()
    lang:Language;
    @Input()
    editable:boolean;
    @Input()
    editing:boolean;
    @Input()
    editingSubColumn:ItemVariantSaleColumn;
    @Input()
    stockList:Immutable.List<LocalStock>;
    @Input()
    actionsVisible:boolean;
    @Input()
    confirmButtonsVisible:boolean;

    onColumnAction(itemVariantSale:LocalItemVariantSale, column:ItemVariantSaleColumn, event, action?:string, value?:any) {
        var actionEvent = new ItemVariantSaleColumnActionEvent();
        actionEvent.itemVariantSale = itemVariantSale;
        actionEvent.column = column;
        actionEvent.action = ItemVariantSaleColumnAction[action];
        actionEvent.event = event;
        actionEvent.value = value;
        this.action.emit(actionEvent);

        if (event != null) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    calcPriceVatInclusive(item:LocalItemVariantSale) {
        var price = item.vatExclusive * (1 + item.vatRate);
        return price;
    }

    calcTotalVatInclusive(item:LocalItemVariantSale) {
        var price = item.total;
        var vat = item.itemVariant.item.vatRate;
        price *= (1 + vat);
        return price;
    }

    hasComment(localItemVariantSale:LocalItemVariantSale) {
        if (localItemVariantSale.comment == null) {
            return false;
        }
        var text = localItemVariantSale.comment.get(this.lang.locale);
        if (text != null && text.trim().length > 0) {
            return true;
        }
        return false;
    }

    validateQuantity(value:string) {
        if (value.length > 0) {
            var intValue = parseInt(value);
            if (isNaN(intValue)) {
                return false;
            }
            return intValue > 0;
        }
        return true;
    }

    validatePrice(value:string) {
        if (value.length > 0) {

            var floatValue = parseFloat(value);
            if (isNaN(floatValue)) {
                return false;
            }
            return floatValue > 0;
        }
        return true;
    }

    validateDiscount(value:string) {
        if (value.length > 0) {
            var intValue = parseInt(value);
            if (isNaN(intValue)) {
                return false;
            }
            return intValue >= 0 && intValue <= 100;
        }
        return true;
    }
}


export class ItemVariantSaleColumnActionEvent {
    itemVariantSale:LocalItemVariantSale;
    column:ItemVariantSaleColumn;
    action:ItemVariantSaleColumnAction;
    event:any;
    value:any;
}


/*****
 * List component
 */

@Component({
    selector: 'item-variant-sale-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/itemVariantSale/list/itemVariantSaleList.html',
    styleUrls: ['./components/itemVariantSale/list/itemVariantSaleList.css'],
    directives: [NgFor, NgIf, FocusableDirective, ItemVariantSaleColumnComponent],
    encapsulation: ViewEncapsulation.None
})

export class ItemVariantSaleList {
    // properties
    @Input()
    sale:LocalSale;
    @Input()
    itemVariantSaleList:Immutable.List<LocalItemVariantSale>;
    @Input()
    columns:Immutable.List<ItemVariantSaleColumn>;
    @Input()
    rowSelectable:boolean;
    @Input()
    headersVisible:boolean;
    @Input()
    footerVisible:boolean;
    @Input()
    footerTotalColIndex:number;
    @Input()
    actionsVisible:boolean = true;
    @Input()
    confirmButtonsVisible:boolean = true;
    @Input()
    editable:boolean;
    @Input()
    editableColumns:Immutable.List<ItemVariantSaleColumn>;
    @Input()
    stockList:Immutable.List<LocalStock>;

    @Output()
    rowClicked = new EventEmitter();
    @Output()
    columnAction = new EventEmitter();
    @Output()
    variantUpdated = new EventEmitter();

    language:Language;
    editing:boolean;
    editingColumn:ItemVariantSaleColumn;
    editingSubColumn:ItemVariantSaleColumn;
    editingVariantSale:LocalItemVariantSale;

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
    }

    isColumnEditable(column:ItemVariantSaleColumn) {
        if (this.editable) {
            return true;
        }
        if (column == ItemVariantSaleColumn.ACTIONS) {
            return true;
        }
        if (this.editableColumns == null) {
            return false;
        }
        return this.editableColumns.contains(column);
    }

    onItemVariantSaleClick(item:ItemVariantSale, event) {
        this.rowClicked.emit(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:ItemVariantSaleColumnActionEvent) {
        var column = event.column;
        if (this.isColumnEditable(column)) {
            var action = event.action;
            switch (action) {
                case ItemVariantSaleColumnAction.EDIT:
                {
                    this.onColumnEditAction(event);
                    return;
                }
                case ItemVariantSaleColumnAction.CONFIRM:
                {
                    this.onColumnConfirmAction(event);
                    return;
                }
                case ItemVariantSaleColumnAction.CANCEL:
                {
                    this.onColumnCancelAction();
                    return;
                }
                case ItemVariantSaleColumnAction.ADD_COMMENT:
                {
                    this.onAddComment(event.itemVariantSale);
                    return;
                }
                case ItemVariantSaleColumnAction.ADD_DISCOUNT:
                {
                    this.onAddDiscount(event.itemVariantSale);
                    return;
                }
            }
        }

        this.columnAction.emit(event);
    }

    private onColumnEditAction(event:ItemVariantSaleColumnActionEvent) {
        this.editing = true;
        this.editingColumn = event.column;
        this.editingVariantSale = event.itemVariantSale;
        if (event.value) {
            this.editingSubColumn = ItemVariantSaleColumn[event.value];
        } else {
            this.editingSubColumn = null;
        }
    }

    private onColumnCancelAction() {
        this.cancelEdit();
    }

    private onColumnConfirmAction(event:ItemVariantSaleColumnActionEvent) {
        if (event.column == ItemVariantSaleColumn.ACTIONS) {
            // Dispatch validate event to row input
            var input = this.doFindInput(event.value);
            if (input == null) {
                // for non-fast-input component, we update the item directly
                this.onColumnCancelAction();
                return;
            }
            input.dispatchEvent(FastInput.VALIDATE_EVENT);
            return;
        }
        // Update column for controls that trigger CONFIRM directly
        if (event.column != null && this.editingColumn == null) {
            this.editingColumn = event.column;
        }
        var itemVariantSale = event.itemVariantSale;
        var value = event.value;
        switch (this.editingColumn) {
            case ItemVariantSaleColumn.COMMENT:
            case ItemVariantSaleColumn.VARIANT_NAME_COMMENT:
                itemVariantSale = this.updateComment(itemVariantSale, value);
                break;
            case ItemVariantSaleColumn.QUANTITY: {
                itemVariantSale = this.updateQuantity(itemVariantSale, value);
                break;
            }
            case ItemVariantSaleColumn.QUANTITY_PRICE:
            {
                if (this.editingSubColumn == ItemVariantSaleColumn.QUANTITY) {
                    itemVariantSale = this.updateQuantity(itemVariantSale, value);
                } else {
                    itemVariantSale = this.updatePrice(itemVariantSale, value);
                }
                break;
            }
            case ItemVariantSaleColumn.UNIT_PRICE: {
                itemVariantSale = this.updatePrice(itemVariantSale, value);
                break;
            }
            case ItemVariantSaleColumn.DISCOUNT:
            case ItemVariantSaleColumn.DISCOUNT_TOTAL_PRICE:
            {
                itemVariantSale = this.updateDiscount(itemVariantSale, value);
                break;
            }
            case ItemVariantSaleColumn.STOCK:
            {
                itemVariantSale = this.updateStock(itemVariantSale, value);
                break;
            }
            case ItemVariantSaleColumn.INCLUDE_CUSTOMER_LOYALTY: {
                itemVariantSale = this.updateCustomerLoyalty(itemVariantSale, value);
                break;
            }
        }
        this.cancelEdit();
        this.variantUpdated.emit(itemVariantSale);
    }

    private cancelEdit() {
        this.editing = false;
        this.editingColumn = null;
        this.editingSubColumn = null;
        this.editingVariantSale = null;
    }

    private onAddComment(variantSale:LocalItemVariantSale) {
        this.columns.toSeq()
            .forEach((column)=> {
                if (!this.isColumnEditable(column)) {
                    return;
                }
                switch (column) {
                    case ItemVariantSaleColumn.COMMENT:
                    {
                        this.editing = true;
                        this.editingColumn = ItemVariantSaleColumn.COMMENT;
                        this.editingSubColumn = null;
                        this.editingVariantSale = variantSale;
                        return;
                    }
                    case ItemVariantSaleColumn.VARIANT_NAME_COMMENT:
                    {
                        this.editing = true;
                        this.editingColumn = ItemVariantSaleColumn.VARIANT_NAME_COMMENT;
                        this.editingSubColumn = ItemVariantSaleColumn.COMMENT;
                        this.editingVariantSale = variantSale;
                        return;
                    }
                }
            });
    }

    private onAddDiscount(variantSale:LocalItemVariantSale) {
        this.columns.toSeq()
            .forEach((column)=> {
                switch (column) {
                    case ItemVariantSaleColumn.DISCOUNT:
                    {
                        this.editing = true;
                        this.editingColumn = ItemVariantSaleColumn.DISCOUNT;
                        this.editingSubColumn = null;
                        this.editingVariantSale = variantSale;
                        return;
                    }
                    case ItemVariantSaleColumn.DISCOUNT_TOTAL_PRICE:
                    {
                        this.editing = true;
                        this.editingColumn = ItemVariantSaleColumn.DISCOUNT_TOTAL_PRICE;
                        this.editingSubColumn = ItemVariantSaleColumn.DISCOUNT;
                        this.editingVariantSale = variantSale;
                        return;
                    }
                }
            });
    }

    private doFindInput(container:HTMLElement) {
        // div -> col element -> td -> tr
        var row = container.parentElement.parentElement.parentElement;
        var inputList = row.getElementsByTagName('input');
        if (inputList.length > 0) {
            return inputList[0];
        }
    }

    updateComment(localItemVariantSale:LocalItemVariantSale, comment:string):LocalItemVariantSale {
        var commentTexts = localItemVariantSale.comment;
        commentTexts[this.language.locale] = comment;
        return <LocalItemVariantSale>localItemVariantSale.set('comment', commentTexts);
    }

    updateQuantity(localItemVariantSale:LocalItemVariantSale, quantityString:string):LocalItemVariantSale {
        var quantity = parseInt(quantityString);
        if (isNaN(quantity)) {
            quantity = 1;
        } else if (quantity < 1) {
            quantity = 1;
        }
        return <LocalItemVariantSale>localItemVariantSale.set('quantity', quantity);
    }

    updatePrice(localItemVariantSale:LocalItemVariantSale, priceString:string):LocalItemVariantSale {
        var price = parseFloat(priceString);
        if (isNaN(price)) {
            return;
        }
        var vatExclusive = NumberUtils.toFixedDecimals(price / ( 1 + localItemVariantSale.vatRate), 4);
        return <LocalItemVariantSale>localItemVariantSale.set('vatExclusive', vatExclusive);
    }

    updateDiscount(localItemVariantSale:LocalItemVariantSale, discountString:string):LocalItemVariantSale {
        var discountPercentage = parseInt(discountString);
        if (isNaN(discountPercentage)) {
            discountPercentage = 0;
        }
        var discountRatio = NumberUtils.toFixedDecimals(discountPercentage / 100, 2);
        return <LocalItemVariantSale>localItemVariantSale.set('discountRatio', discountRatio);
    }

    updateStock(localItemVariantSale:LocalItemVariantSale, stockId: number):LocalItemVariantSale {
        var stock = this.stockList.toSeq().filter((listStock)=>{
            return listStock.id == stockId;
        }).first();
        return <LocalItemVariantSale>localItemVariantSale.set('stock', stock);
    }
    updateCustomerLoyalty(localItemVariantSale:LocalItemVariantSale, customerLoyalty: string | boolean):LocalItemVariantSale {
        if (typeof customerLoyalty == 'string') {
            if (customerLoyalty == "true") {
                customerLoyalty = true;
            }
        }
        return <LocalItemVariantSale>localItemVariantSale.set('includeCustomerLoyalty', customerLoyalty);
    }

}

export class ItemVariantSaleColumn {

    static ID:ItemVariantSaleColumn;
    static DATE_TIME:ItemVariantSaleColumn;
    static VARIANT_NAME:ItemVariantSaleColumn;
    static VARIANT_NAME_COMMENT:ItemVariantSaleColumn;
    static COMMENT:ItemVariantSaleColumn;
    static VARIANT_REF:ItemVariantSaleColumn;
    static QUANTITY:ItemVariantSaleColumn;
    static QUANTITY_PRICE:ItemVariantSaleColumn;
    static UNIT_PRICE:ItemVariantSaleColumn;
    static TOTAL_PRICE:ItemVariantSaleColumn;
    static DISCOUNT:ItemVariantSaleColumn;
    static DISCOUNT_TOTAL_PRICE:ItemVariantSaleColumn;
    static VAT_EXCLUSIVE:ItemVariantSaleColumn;
    static VAT_RATE:ItemVariantSaleColumn;
    static STOCK:ItemVariantSaleColumn;
    static SALE:ItemVariantSaleColumn;
    static ACTIONS:ItemVariantSaleColumn;
    static INCLUDE_CUSTOMER_LOYALTY:ItemVariantSaleColumn;

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        ItemVariantSaleColumn.ID = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.ID.name = 'id';
        ItemVariantSaleColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Id'
        });
        ItemVariantSaleColumn.DATE_TIME = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.DATE_TIME.name = 'dateTime';
        ItemVariantSaleColumn.DATE_TIME.alignCenter = true;
        ItemVariantSaleColumn.DATE_TIME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Date'
        });
        ItemVariantSaleColumn.VARIANT_NAME = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.VARIANT_NAME.name = 'variantName';
        ItemVariantSaleColumn.VARIANT_NAME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Nom'
        });
        ItemVariantSaleColumn.VARIANT_NAME_COMMENT = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.VARIANT_NAME_COMMENT.name = 'variantNameComment';
        ItemVariantSaleColumn.VARIANT_NAME_COMMENT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Nom'
        });
        ItemVariantSaleColumn.COMMENT = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.COMMENT.name = 'comment';
        ItemVariantSaleColumn.COMMENT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Commentaire'
        });
        ItemVariantSaleColumn.VARIANT_REF = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.VARIANT_REF.name = 'variantRef';
        ItemVariantSaleColumn.VARIANT_REF.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Réf'
        });
        ItemVariantSaleColumn.QUANTITY = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.QUANTITY.name = 'quantity';
        ItemVariantSaleColumn.QUANTITY.alignRight = true;
        ItemVariantSaleColumn.QUANTITY.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Quantité'
        });
        ItemVariantSaleColumn.QUANTITY_PRICE = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.QUANTITY_PRICE.name = 'quantityPrice';
        ItemVariantSaleColumn.QUANTITY_PRICE.alignRight = true;
        ItemVariantSaleColumn.QUANTITY_PRICE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Quantité'
        });
        ItemVariantSaleColumn.UNIT_PRICE = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.UNIT_PRICE.name = 'unitPrice';
        ItemVariantSaleColumn.UNIT_PRICE.alignRight = true;
        ItemVariantSaleColumn.UNIT_PRICE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Prix unitaire'
        });
        ItemVariantSaleColumn.TOTAL_PRICE = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.TOTAL_PRICE.name = 'totalPrice';
        ItemVariantSaleColumn.TOTAL_PRICE.alignRight = true;
        ItemVariantSaleColumn.TOTAL_PRICE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Prix'
        });
        ItemVariantSaleColumn.DISCOUNT = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.DISCOUNT.name = 'discount';
        ItemVariantSaleColumn.DISCOUNT.alignRight = true;
        ItemVariantSaleColumn.DISCOUNT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Réduction'
        });
        ItemVariantSaleColumn.DISCOUNT_TOTAL_PRICE = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.DISCOUNT_TOTAL_PRICE.name = 'discountTotalPrice';
        ItemVariantSaleColumn.DISCOUNT_TOTAL_PRICE.alignRight = true;
        ItemVariantSaleColumn.DISCOUNT_TOTAL_PRICE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Prix'
        });
        ItemVariantSaleColumn.VAT_EXCLUSIVE = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.VAT_EXCLUSIVE.name = 'vatExclusive';
        ItemVariantSaleColumn.VAT_EXCLUSIVE.alignRight = true;
        ItemVariantSaleColumn.VAT_EXCLUSIVE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Prix unitaire HTVA'
        });
        ItemVariantSaleColumn.VAT_RATE = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.VAT_RATE.name = 'vatRate';
        ItemVariantSaleColumn.VAT_RATE.alignRight = true;
        ItemVariantSaleColumn.VAT_RATE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Taux TVA'
        });
        ItemVariantSaleColumn.STOCK = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.STOCK.name = 'stock';
        ItemVariantSaleColumn.STOCK.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Stock'
        });
        ItemVariantSaleColumn.SALE = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.SALE.name = 'sale';
        ItemVariantSaleColumn.SALE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Vente'
        });
        ItemVariantSaleColumn.INCLUDE_CUSTOMER_LOYALTY = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.INCLUDE_CUSTOMER_LOYALTY.name = 'includeCustomerLoyalty';
        ItemVariantSaleColumn.INCLUDE_CUSTOMER_LOYALTY.alignCenter = true;
        ItemVariantSaleColumn.INCLUDE_CUSTOMER_LOYALTY.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Épargne fidelité'
        });
        ItemVariantSaleColumn.ACTIONS = new ItemVariantSaleColumn();
        ItemVariantSaleColumn.ACTIONS.name = 'actions';
        ItemVariantSaleColumn.ACTIONS.title = LocaleTextsFactory.toLocaleTexts({
            'fr': ''
        });
    }
}

ItemVariantSaleColumn.init();

export enum ItemVariantSaleColumnAction {
    REMOVE,
    ADD_DISCOUNT,
    ADD_COMMENT,
    EDIT,
    CONFIRM,
    CANCEL
}
