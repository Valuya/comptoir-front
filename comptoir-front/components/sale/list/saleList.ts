/**
 * Created by cghislai on 29/07/15.
 */

import {Component, ChangeDetectionStrategy, EventEmitter, ViewEncapsulation, Input, Output} from 'angular2/core';
import { NgFor, NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

import {Sale} from '../../../domain/commercial/sale';
import {Language, LocaleTexts, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';

import * as Immutable from 'immutable';
import {CustomerSelectComponent} from "../../customer/select/customerSelect";


/****
 * Column component
 */
@Component({
    selector: 'sale-column',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/sale/list/saleColumn.html',
    styleUrls: ['./components/sale/list/saleList.css'],
    directives: [NgIf, NgSwitch, NgSwitchWhen, CustomerSelectComponent],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class SaleColumnComponent {
    @Input()
    sale:Sale;
    @Input()
    column:SaleColumn;
    @Input()
    lang:Language;
    @Output()
    action = new EventEmitter();

    onColumnAction(sale:Sale, column:SaleColumn, event) {
        this.action.next({sale: sale, column: column});
        event.stopPropagation();
        event.preventDefault();
    }

}


/*****
 * List component
 */

@Component({
    selector: 'sale-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/sale/list/saleList.html',
    styleUrls: ['./components/sale/list/saleList.css'],
    directives: [NgFor, NgIf, FocusableDirective, SaleColumnComponent]
})

export class SaleListComponent {
    @Input()
    sales:Immutable.List<Sale>;
    @Input()
    columns:Immutable.List<SaleColumn>;
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

    onSaleClick(sale:Sale, event) {
        this.rowClicked.next(sale);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class SaleColumn {

    static ID:SaleColumn;
    static DATETIME:SaleColumn;
    static VAT_EXCLUSIVE_AMOUNT:SaleColumn;
    static VAT_INCLUSIVE_AMOUNT:SaleColumn;
    static VAT_AMOUNT:SaleColumn;
    static CLOSED:SaleColumn;
    static CUSTOMER:SaleColumn;
    static REFERENCE:SaleColumn;
    static ACTION_REMOVE:SaleColumn;

    title:LocaleTexts;
    name:string;
    alignRight:boolean;

    static init() {
        SaleColumn.ID = new SaleColumn();
        SaleColumn.ID.name = 'id';
        SaleColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Id'
        });

        SaleColumn.DATETIME = new SaleColumn();
        SaleColumn.DATETIME.name = 'dateTime';
        SaleColumn.DATETIME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Date'
        });

        SaleColumn.VAT_EXCLUSIVE_AMOUNT = new SaleColumn();
        SaleColumn.VAT_EXCLUSIVE_AMOUNT.name = 'vatExclusive';
        SaleColumn.VAT_EXCLUSIVE_AMOUNT.alignRight = true;
        SaleColumn.VAT_EXCLUSIVE_AMOUNT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Total HTVA'
        });

        SaleColumn.VAT_INCLUSIVE_AMOUNT = new SaleColumn();
        SaleColumn.VAT_INCLUSIVE_AMOUNT.name = 'vatInclusive';
        SaleColumn.VAT_INCLUSIVE_AMOUNT.alignRight = true;
        SaleColumn.VAT_INCLUSIVE_AMOUNT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Total'
        });

        SaleColumn.VAT_AMOUNT = new SaleColumn();
        SaleColumn.VAT_AMOUNT.name = 'vat';
        SaleColumn.VAT_AMOUNT.alignRight = true;
        SaleColumn.VAT_AMOUNT.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'TVA'
        });

        SaleColumn.CLOSED = new SaleColumn();
        SaleColumn.CLOSED.name = 'closed';
        SaleColumn.CLOSED.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Clôturée'
        });

        SaleColumn.REFERENCE = new SaleColumn();
        SaleColumn.REFERENCE.name = 'ref';
        SaleColumn.REFERENCE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Référence'
        });
        SaleColumn.CUSTOMER = new SaleColumn();
        SaleColumn.CUSTOMER.name = 'customer';
        SaleColumn.CUSTOMER.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Client'
        });

        SaleColumn.ACTION_REMOVE = new SaleColumn();
        SaleColumn.ACTION_REMOVE.name = 'action_remove';
        SaleColumn.ACTION_REMOVE.title = null;
    }
}

SaleColumn.init();
