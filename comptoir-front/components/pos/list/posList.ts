/**
 * Created by cghislai on 29/07/15.
 */

import {Component, ChangeDetectionStrategy, ViewEncapsulation, EventEmitter, Input, Output} from 'angular2/core';
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

import {WsPos} from '../../../client/domain/commercial/pos';

import {Language, LocaleTexts, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';

import * as Immutable from 'immutable';

/****
 * Column component
 */
@Component({
    selector: 'pos-column',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/pos/list/posColumn.html',
    styleUrls: ['./components/pos/list/posList.css'],
    directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class PosColumnComponent {
    @Input()
    pos:WsPos;
    @Input()
    column:PosColumn;
    @Input()
    lang:Language;
    @Output()
    action = new EventEmitter();

    onColumnAction(pos:WsPos, column:PosColumn, event) {
        this.action.emit({pos: pos, column: column});
        event.stopPropagation();
        event.preventDefault();
    }
}


/*****
 * List component
 */

@Component({
    selector: 'pos-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/pos/list/posList.html',
    styleUrls: ['./components/pos/list/posList.css'],
    directives: [NgFor, NgIf, FocusableDirective, PosColumnComponent]
})

export class PosListComponent {
    @Input()
    posList:Immutable.List<WsPos>;
    @Input()
    columns:Immutable.List<PosColumn>;
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


    onPosClick(item:WsPos, event) {
        this.rowClicked.emit(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.emit(event);
    }

}

export class PosColumn {

    static ID:PosColumn;
    static NAME:PosColumn;
    static DESCRIPTION:PosColumn;
    static DEFAULT_CUSTOMER:PosColumn;

    static ACTION_REMOVE:PosColumn;

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        PosColumn.ID = new PosColumn();
        PosColumn.ID.name = 'id';
        PosColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Id'
        });

        PosColumn.NAME = new PosColumn();
        PosColumn.NAME.name = 'name';
        PosColumn.NAME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Nom'
        });

        PosColumn.DESCRIPTION = new PosColumn();
        PosColumn.DESCRIPTION.name = 'description';
        PosColumn.DESCRIPTION.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Description'
        });

        PosColumn.DEFAULT_CUSTOMER = new PosColumn();
        PosColumn.DEFAULT_CUSTOMER.name = 'defaultCustomer';
        PosColumn.DEFAULT_CUSTOMER.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Client par défaut'
        });


        PosColumn.ACTION_REMOVE = new PosColumn();
        PosColumn.ACTION_REMOVE.name = 'action_remove';
        PosColumn.ACTION_REMOVE.title = null;
    }
}

PosColumn.init();
