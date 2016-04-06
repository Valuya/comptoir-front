/**
 * Created by cghislai on 29/07/15.
 */

import {Component, ChangeDetectionStrategy, ViewEncapsulation, EventEmitter} from 'angular2/core';
import {NgFor, NgIf, NgSwitch, NgSwitchWhen} from 'angular2/common';

import {WsCustomer} from '../../../client/domain/thirdparty/customer';

import {Language, LocaleTexts, LocaleTextsFactory} from '../../../client/utils/lang';

import {AuthService} from '../../../services/auth';

import {FocusableDirective} from '../../utils/focusable';

import * as Immutable from 'immutable';

/****
 * Column component
 */
@Component({
    selector: 'customer-column',
    inputs: ['customer', 'column', 'lang'],
    outputs: ['action'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/customer/list/customerColumn.html',
    styleUrls: ['./components/customer/list/customerList.css'],
    directives: [NgIf, NgFor, NgSwitch, NgSwitchWhen],
    // eases styling
    encapsulation: ViewEncapsulation.None
})
export class CustomerColumnComponent {
    action = new EventEmitter();
    customer:WsCustomer;
    column:CustomerColumn;
    lang:Language;

    onColumnAction(customer:WsCustomer, column:CustomerColumn, event) {
        this.action.next({customer: customer, column: column});
        event.stopPropagation();
        event.preventDefault();
    }
}


/*****
 * List component
 */

@Component({
    selector: 'customer-list',
    inputs: ['customerList', 'columns', 'rowSelectable', 'headersVisible'],
    outputs: ['rowClicked', 'columnAction'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './components/customer/list/customerList.html',
    styleUrls: ['./components/customer/list/customerList.css'],
    directives: [NgFor, NgIf, FocusableDirective, CustomerColumnComponent]
})

export class CustomerListComponent {
    // properties
    customerList:Immutable.List<WsCustomer>;
    columns:Immutable.List<CustomerColumn>;
    rowSelectable:boolean;
    headersVisible:boolean;
    language:Language;

    rowClicked = new EventEmitter();
    columnAction = new EventEmitter();

    constructor(authService:AuthService) {
        this.language = authService.getEmployeeLanguage();
    }


    onCustomerClick(item:WsCustomer, event) {
        this.rowClicked.next(item);
        event.stopPropagation();
        event.preventDefault();
    }

    onColumnAction(event:any) {
        this.columnAction.next(event);
    }

}

export class CustomerColumn {

    static ID:CustomerColumn;
    static FIRST_NAME:CustomerColumn;
    static LAST_NAME:CustomerColumn;
    static ADDRESS1:CustomerColumn;
    static ADDRESS2:CustomerColumn;
    static ZIP:CustomerColumn;
    static CITY:CustomerColumn;
    static PHONE1:CustomerColumn;
    static PHONE2:CustomerColumn;
    static EMAIL:CustomerColumn;
    static NOTES:CustomerColumn;
    static LOYALTY_BALANCE:CustomerColumn;
    static ACTION_REMOVE:CustomerColumn;

    title:LocaleTexts;
    name:string;
    alignRight:boolean;
    alignCenter:boolean;

    static init() {
        CustomerColumn.ID = new CustomerColumn();
        CustomerColumn.ID.name = 'id';
        CustomerColumn.ID.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Id'
        });

        CustomerColumn.FIRST_NAME = new CustomerColumn();
        CustomerColumn.FIRST_NAME.name = 'firstName';
        CustomerColumn.FIRST_NAME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Prénom'
        });
        CustomerColumn.LAST_NAME = new CustomerColumn();
        CustomerColumn.LAST_NAME.name = 'lastName';
        CustomerColumn.LAST_NAME.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Nom'
        });
        CustomerColumn.ADDRESS1 = new CustomerColumn();
        CustomerColumn.ADDRESS1.name = 'address1';
        CustomerColumn.ADDRESS1.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Adresse 1'
        });
        CustomerColumn.ADDRESS2 = new CustomerColumn();
        CustomerColumn.ADDRESS2.name = 'address2';
        CustomerColumn.ADDRESS2.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Adresse 2'
        });
        CustomerColumn.ZIP = new CustomerColumn();
        CustomerColumn.ZIP.name = 'zip';
        CustomerColumn.ZIP.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Code postal'
        });
        CustomerColumn.CITY = new CustomerColumn();
        CustomerColumn.CITY.name = 'city';
        CustomerColumn.CITY.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Localité'
        });
        CustomerColumn.PHONE1 = new CustomerColumn();
        CustomerColumn.PHONE1.name = 'phone1';
        CustomerColumn.PHONE1.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Téléphone 1'
        });

        CustomerColumn.PHONE2 = new CustomerColumn();
        CustomerColumn.PHONE2.name = 'phone2';
        CustomerColumn.PHONE2.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Téléphone 2'
        });

        CustomerColumn.EMAIL = new CustomerColumn();
        CustomerColumn.EMAIL.name = 'email';
        CustomerColumn.EMAIL.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'E-mail'
        });

        CustomerColumn.NOTES = new CustomerColumn();
        CustomerColumn.NOTES.name = 'notes';
        CustomerColumn.NOTES.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Notes'
        });

        CustomerColumn.LOYALTY_BALANCE = new CustomerColumn();
        CustomerColumn.LOYALTY_BALANCE.name = 'loyaltyBalance';
        CustomerColumn.LOYALTY_BALANCE.title = LocaleTextsFactory.toLocaleTexts({
            'fr': 'Solde fidelité'
        });


        CustomerColumn.ACTION_REMOVE = new CustomerColumn();
        CustomerColumn.ACTION_REMOVE.name = 'action_remove';
        CustomerColumn.ACTION_REMOVE.title = null;
    }
}

CustomerColumn.init();
