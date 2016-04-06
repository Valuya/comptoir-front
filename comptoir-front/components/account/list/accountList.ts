/**
 * Created by cghislai on 29/07/15.
 */

import {
    Component, ChangeDetectionStrategy, OnInit, EventEmitter, ViewEncapsulation, Output,
    Input
} from 'angular2/core';
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

import {Account} from '../../../domain/accounting/account';

import {Language, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';
import {Column} from '../../utils/column';

import * as Immutable from 'immutable';
/****
 * Column component
 */
@Component({
    selector: 'account-column',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/account/list/accountColumn.html',
    styleUrls: ['./components/account/list/accountList.css'],
    directives: [NgIf, NgSwitch, NgSwitchWhen, FocusableDirective],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class AccountColumnComponent {
    @Output()
    action = new EventEmitter();
    @Input()
    account:Account;
    @Input()
    column:AccountColumn;
    @Input()
    lang:Language;

    onColumnAction(account:Account, column:AccountColumn, event) {
        this.action.emit({account: account, column: column});
        event.stopPropagation();
        event.preventDefault();
    }

}


/*****
 * List component
 */

@Component({
    selector: 'account-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/account/list/accountList.html',
    styleUrls: ['./components/account/list/accountList.css'],
    directives: [NgFor, NgIf, FocusableDirective, AccountColumnComponent]
})

export class AccountListComponent implements OnInit {
    @Input()
    accounts:Immutable.List<Account>;
    @Input()
    columns:Immutable.List<AccountColumn>;
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

    onAccountClick(account:Account, event) {
        this.rowClicked.emit(account);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.emit(event);
    }

}

export class AccountColumn extends Column {

    static ID:AccountColumn;
    static ACCOUNTING_NUMBER:AccountColumn;
    static IBAN:AccountColumn;
    static BIC:AccountColumn;
    static NAME:AccountColumn;
    static DESCRIPTION:AccountColumn;
    static TYPE:AccountColumn;
    static ACTION_REMOVE:AccountColumn;

    static init() {
        AccountColumn.ID = new AccountColumn(
            'id', 1,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Id'
            }));

        AccountColumn.ACCOUNTING_NUMBER = new AccountColumn(
            'accountingNumber', 3,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Numéro de comptabilité'
            }), true);

        AccountColumn.IBAN = new AccountColumn(
            'iban', 3,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'IBAN'
            }), true);

        AccountColumn.BIC = new AccountColumn(
            'bic', 3,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'BIC'
            }), true);

        AccountColumn.NAME = new AccountColumn(
            'name', 3,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Nom'
            })
        );

        AccountColumn.DESCRIPTION = new AccountColumn(
            'description', 5,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Description'
            })
        );

        AccountColumn.TYPE = new AccountColumn(
            'type', 2,
            LocaleTextsFactory.toLocaleTexts({
                'fr': 'Type'
            })
        );

        AccountColumn.ACTION_REMOVE = new AccountColumn(
            'action_remove', 1
        );
    }
}

AccountColumn.init();
