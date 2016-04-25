/**
 * Created by cghislai on 29/07/15.
 */

import {
    Component, ChangeDetectionStrategy, OnInit,
    EventEmitter, ViewEncapsulation, Input, Output
} from 'angular2/core';
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

import {Item} from '../../../domain/commercial/item';

import {Language, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';
import {Column} from '../../utils/column';

import * as Immutable from 'immutable';
/****
 * Column component
 */
@Component({
    selector: 'item-column',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/item/list/itemColumn.html',
    styleUrls: ['./components/item/list/itemList.css'],
    directives: [NgIf, NgSwitch, NgSwitchWhen, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class ItemColumnComponent {
    @Input()
    item:Item;
    @Input()
    column:ItemColumn;
    @Input()
    lang:Language;

    @Output()
    action = new EventEmitter();

    onColumnAction(item:Item, column:ItemColumn, event) {
        this.action.emit({item: item, column: column});
        event.stopPropagation();
        event.preventDefault();
    }

}


/*****
 * List component
 */

@Component({
    selector: 'item-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/item/list/itemList.html',
    styleUrls: ['./components/item/list/itemList.css'],
    directives: [NgFor, NgIf, FocusableDirective, ItemColumnComponent]
})

export class ItemListComponent implements OnInit {
    @Input()
    items:Immutable.List<Item>;
    @Input()
    columns:Immutable.List<ItemColumn>;
    @Input()
    rowSelectable:boolean;
    @Input()
    headersVisible:boolean;

    @Output()
    rowClicked = new EventEmitter();
    @Output()
    columnAction = new EventEmitter();

    language:Language;
    columnWeightToPercentage:number;

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
    }

    ngOnInit() {
        this.calcColumnWeightFactor();
    }

    calcColumnWeightFactor() {
        let totWeight = this.columns.valueSeq()
            .reduce((r, col)=>r + col.weight, 0);
        this.columnWeightToPercentage = 100.0 / totWeight;
    }


    onItemClick(item:Item, event) {
        this.rowClicked.emit(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onItemKeyDown(item: Item, event) {
        // TODO: use event.key once supported
        switch (event.which) {
            case 13: {
                // Enter
                this.rowClicked.emit(item);
                break;
            }
            case 38: {
                // Up
                this.selectPrevious(event.target);
                break;
            }
            case 40: {
                // Down
                this.selectNext(event.target);
                break;
            }
        }
    }

    private selectPrevious(element:HTMLElement ) {
        var previous = <HTMLElement>element.previousElementSibling;
        if (previous) {
            previous.focus();
        }
    }
    private selectNext(element:HTMLElement ) {
        var next = <HTMLElement>element.nextElementSibling;
        if (next) {
            next.focus();
        }
    }



    onColumnAction(event:any) {
        this.columnAction.emit(event);
    }

}

export class ItemColumn extends Column {

    static ID:ItemColumn;
    static REFERENCE:ItemColumn;
    static NAME:ItemColumn;
    static DESCRIPTION:ItemColumn;
    static NAME_AND_DESCRIPTION:ItemColumn;
    static VAT_EXCLUSIVE:ItemColumn;
    static VAT_RATE:ItemColumn;
    static VAT_INCLUSIVE:ItemColumn;
    static PICTURE:ItemColumn;
    static ACTION_REMOVE:ItemColumn;

    static init() {
        ItemColumn.ID = new ItemColumn(
            'id', 1,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Id'
            })
        );

        ItemColumn.REFERENCE = new ItemColumn(
            'ref', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Ref'
            })
        );

        ItemColumn.NAME = new ItemColumn(
            'name', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Nom'
            })
        );

        ItemColumn.DESCRIPTION = new ItemColumn(
            'description', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Description'
            })
        );

        ItemColumn.NAME_AND_DESCRIPTION = new ItemColumn(
            'name_and_description', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Nom / Description'
            })
        );

        ItemColumn.VAT_EXCLUSIVE = new ItemColumn(
            'vat_exclusive', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Prix HTVA'
            }), true
        );

        ItemColumn.VAT_RATE = new ItemColumn(
            'vat_rate', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Taux TVA'
            }), true
        );

        ItemColumn.VAT_INCLUSIVE = new ItemColumn(
            'vat_inclusive', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Prix'
            }), true
        );

        ItemColumn.PICTURE = new ItemColumn(
            'picture', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Image'
            }), false, true
        );

        ItemColumn.ACTION_REMOVE = new ItemColumn(
            'action_remove', 1
        );
    }
}

ItemColumn.init();