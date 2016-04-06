/**
 * Created by cghislai on 29/07/15.
 */

import {Component, ChangeDetectionStrategy, ViewEncapsulation, EventEmitter, Input, Output} from 'angular2/core';
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

import {WsStock} from '../../../client/domain/stock/stock';

import {Language, LocaleTexts, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';

import * as Immutable from 'immutable';

/****
 * Column component
 */
@Component({
    selector: 'stock-column',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/stock/list/stockColumn.html',
    styleUrls: ['./components/stock/list/stockList.css'],
    directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class StockColumnComponent {
    @Input()
    stock:WsStock;
    @Input()
    column:StockColumn;
    @Input()
    lang:Language;
    @Output()
    action = new EventEmitter();

    onColumnAction(stock:WsStock, column:StockColumn, event) {
        this.action.emit({stock: stock, column: column});
        event.stopPropagation();
        event.preventDefault();
    }
}


/*****
 * List component
 */

@Component({
    selector: 'stock-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/stock/list/stockList.html',
    styleUrls: ['./components/stock/list/stockList.css'],
    directives: [NgFor, NgIf, FocusableDirective, StockColumnComponent]
})

export class StockListComponent {
    @Input()
    stockList:Immutable.List<WsStock>;
    @Input()
    columns:Immutable.List<StockColumn>;
    @Input()
    rowSelectable:boolean;
    @Input()
    headersVisible:boolean;

    @Output()
    rowClicked = new EventEmitter();
    @Output()
    columnAction = new EventEmitter();

    language:Language;

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
    }


    onStockClick(item:WsStock, event) {
        this.rowClicked.emit(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.emit(event);
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
