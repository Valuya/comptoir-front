/**
 * Created by cghislai on 29/07/15.
 */

import {Component, Input, Output, ChangeDetectionStrategy, ViewEncapsulation, EventEmitter} from "angular2/core";
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from "angular2/common";
import {Language, LocaleTexts, LocaleTextsFactory} from "../../../client/utils/lang";
import {AuthService} from "../../../services/auth";
import {FocusableDirective} from "../../utils/focusable";
import * as Immutable from "immutable";
import {LocalItemVariantStock} from "../../../domain/itemVariantStock";
import {RouterLink} from "angular2/router";
import {WsItemVariantStock} from "../../../client/domain/stock/itemVariantStock";
import {StockChangeType} from "../../../client/domain/util/stockChangeType";

/****
 * Column component
 */
@Component({
    selector: 'item-variant-stock-column',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/itemVariantStock/list/itemVariantStockColumn.html',
    styleUrls: ['./components/itemVariantStock/list/itemVariantStockList.css'],
    directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen, RouterLink],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class ItemVariantStockColumnComponent {
    @Output()
    action = new EventEmitter();
    @Input()
    itemVariantStock:LocalItemVariantStock;
    @Input()
    column:ItemVariantStockColumn;
    @Input()
    lang:Language;

    onColumnAction(itemVariantStock:WsItemVariantStock, column:ItemVariantStockColumn, event) {
        this.action.emit({itemVariantStock: WsItemVariantStock, column: column});
        event.stopPropagation();
        event.preventDefault();
    }

    getChangeTypeLabel(changeType: StockChangeType) {
        if (changeType == null) {
            return null;
        }
        var labelText: LocaleTexts;
        switch (changeType) {
            case StockChangeType.ADJUSTMENT:
                labelText = LocaleTextsFactory.toLocaleTexts({
                    'fr': 'Ajustement'
                });
                break;
            case StockChangeType.INITIAL:
                labelText = LocaleTextsFactory.toLocaleTexts({
                    'fr': 'Initital'
                });
                break;
            case StockChangeType.SALE:
                labelText = LocaleTextsFactory.toLocaleTexts({
                    'fr': 'Vente'
                });
                break;
            case StockChangeType.TRANSFER:
                labelText = LocaleTextsFactory.toLocaleTexts({
                    'fr': 'Transfert'
                });
                break;
        }
        return labelText[this.lang.locale];
    }s
}


/*****
 * List component
 */

@Component({
    selector: 'item-variant-stock-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/itemVariantStock/list/itemVariantStockList.html',
    styleUrls: ['./components/itemVariantStock/list/itemVariantStockList.css'],
    directives: [NgFor, NgIf, FocusableDirective, ItemVariantStockColumnComponent]
})

export class ItemVariantStockList {
    // properties
    @Input()
    itemVariantStockList:Immutable.List<LocalItemVariantStock>;
    @Input()
    columns:Immutable.List<ItemVariantStockColumn>;
    @Input()
    rowSelectable:boolean;
    @Input()
    headersVisible:boolean;
    language:Language;

    @Output()
    rowClicked = new EventEmitter();
    @Output()
    columnAction = new EventEmitter();

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
    }


    onItemVariantStockClick(item:WsItemVariantStock, event) {
        this.rowClicked.next(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.emit(event);
    }

}

export class ItemVariantStockColumn {

    static ID:ItemVariantStockColumn;
    static CHANGE_TYPE:ItemVariantStockColumn;
    static START_DATE:ItemVariantStockColumn;
    static END_DATE:ItemVariantStockColumn;
    static ITEM_VARIANT:ItemVariantStockColumn;
    static STOCK:ItemVariantStockColumn;
    static QUANTITY:ItemVariantStockColumn;
    static COMMENT:ItemVariantStockColumn;

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        ItemVariantStockColumn.ID = new ItemVariantStockColumn();
        ItemVariantStockColumn.ID.name = 'id';
        ItemVariantStockColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Id'
        });


        ItemVariantStockColumn.CHANGE_TYPE = new ItemVariantStockColumn();
        ItemVariantStockColumn.CHANGE_TYPE.name = 'changeType';
        ItemVariantStockColumn.CHANGE_TYPE.alignCenter = true;
        ItemVariantStockColumn.CHANGE_TYPE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Type'
        });

        ItemVariantStockColumn.START_DATE = new ItemVariantStockColumn();
        ItemVariantStockColumn.START_DATE.name = 'startDate';
        ItemVariantStockColumn.START_DATE.alignCenter = true;
        ItemVariantStockColumn.START_DATE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Date'
        });
        ItemVariantStockColumn.END_DATE = new ItemVariantStockColumn();
        ItemVariantStockColumn.END_DATE.name = 'endDate';
        ItemVariantStockColumn.END_DATE.alignCenter = true;
        ItemVariantStockColumn.END_DATE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Fin'
        });
        ItemVariantStockColumn.QUANTITY = new ItemVariantStockColumn();
        ItemVariantStockColumn.QUANTITY.name = 'quantity';
        ItemVariantStockColumn.QUANTITY.alignRight = true;
        ItemVariantStockColumn.QUANTITY.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Quantité'
        });
        ItemVariantStockColumn.COMMENT = new ItemVariantStockColumn();
        ItemVariantStockColumn.COMMENT.name = 'comment';
        ItemVariantStockColumn.COMMENT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Commentaire'
        });
        ItemVariantStockColumn.ITEM_VARIANT = new ItemVariantStockColumn();
        ItemVariantStockColumn.ITEM_VARIANT.name = 'variant';
        ItemVariantStockColumn.ITEM_VARIANT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Variante (ref)'
        });
        ItemVariantStockColumn.STOCK = new ItemVariantStockColumn();
        ItemVariantStockColumn.STOCK.name = 'stock';
        ItemVariantStockColumn.STOCK.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Stock (ref)'
        });
    }
}

ItemVariantStockColumn.init();
