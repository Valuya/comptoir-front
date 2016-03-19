/**
 * Created by cghislai on 29/07/15.
 */

import {Component, ChangeDetectionStrategy, ViewEncapsulation, EventEmitter} from 'angular2/core';
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

import {Stock} from '../../../client/domain/stock';

import {Language, LocaleTexts, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';

import * as Immutable from 'immutable';

/****
 * Column component
 */
@Component({
    selector: 'stock-column',
    inputs: ['stock', 'column', 'lang'],
    outputs: ['action'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/stock/list/stockColumn.html',
    styleUrls: ['./components/stock/list/stockList.css'],
    directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class StockColumnComponent {
    action = new EventEmitter();
    stock:Stock;
    column:StockColumn;
    lang:Language;

    onColumnAction(stock:Stock, column:StockColumn, event) {
        this.action.next({stock: stock, column: column});
        event.stopPropagation();
        event.preventDefault();
    }
}


/*****
 * List component
 */

@Component({
    selector: 'stock-list',
    inputs: ['stockList', 'columns', 'rowSelectable', 'headersVisible'],
    outputs: ['rowClicked', 'columnAction'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/stock/list/stockList.html',
    styleUrls: ['./components/stock/list/stockList.css'],
    directives: [NgFor, NgIf, FocusableDirective, StockColumnComponent]
})

export class StockList {
    // properties
    stockList:Immutable.List<Stock>;
    columns:Immutable.List<StockColumn>;
    rowSelectable:boolean;
    headersVisible:boolean;
    language:Language;

    rowClicked = new EventEmitter();
    columnAction = new EventEmitter();

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
    }


    onStockClick(item:Stock, event) {
        this.rowClicked.next(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class StockColumn {

    static ID:StockColumn;
    static DESCRIPTION:StockColumn;
    static ACTION_REMOVE:StockColumn;

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        StockColumn.ID = new StockColumn();
        StockColumn.ID.name = 'id';
        StockColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Id'
        });


        StockColumn.DESCRIPTION = new StockColumn();
        StockColumn.DESCRIPTION.name = 'description';
        StockColumn.DESCRIPTION.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Description'
        });

        StockColumn.ACTION_REMOVE = new StockColumn();
        StockColumn.ACTION_REMOVE.name = 'action_remove';
        StockColumn.ACTION_REMOVE.title = null;
    }
}

StockColumn.init();
