/**
 * Created by cghislai on 29/07/15.
 */

import {Component, View, EventEmitter, NgFor, NgIf} from 'angular2/angular2';

import {Sale} from 'client/domain/sale';
import {Account, AccountRef,AccountSearch} from 'client/domain/account';
import {Balance, BalanceRef, BalanceSearch} from 'client/domain/balance'
import {Pos, PosRef} from 'client/domain/pos';
import {ASale, ASalePay, ASalePayItem} from 'client/utils/aSale';
import {SearchResult} from 'client/utils/search';

import {ErrorService} from 'services/error';
import {AccountService} from 'services/account';
import {AuthService} from 'services/auth';
import {PaymentService} from 'services/payment';

import {FastInput} from 'directives/fastInput'


@Component({
    selector: "payView",
    events: ['paid'],
    properties: ['saleProp: sale', 'posProp: pos', 'noInput']
})
@View({
    templateUrl: './components/sales/sale/payView/payView.html',
    styleUrls: ['./components/sales/sale/payView/payView.css'],
    directives: [NgFor, NgIf, FastInput]
})

export class PayView {
    accountService:AccountService;
    paymentService:PaymentService;
    errorService:ErrorService;
    locale:string;

    aSalePay:ASalePay;
    editingPayItem:ASalePayItem;
    pos:Pos;
    sale:ASale;
    noInput:boolean;

    paid = new EventEmitter();

    allAccounts:Account[];


    constructor(accountService:AccountService, errorService:ErrorService,
                paymentService:PaymentService, authService: AuthService) {
        this.accountService = accountService;
        this.paymentService = paymentService;
        this.errorService = errorService;
        this.locale = authService.getEmployeeLanguage().locale;
        this.aSalePay = new ASalePay();
    }

    set saleProp(value:ASale) {
        this.sale = value;
        this.start();
    }

    set posProp(value:Pos) {
        this.pos = value;
        this.start();
    }

    private hasSale():boolean {
        return this.aSalePay != null
            && this.sale != null
            && this.sale.sale != null;
    }

    start() {
        if (!this.hasSale()) {
            return;
        }
        if (!this.sale.sale.closed) {
            if (this.pos == null) {
                return;
            }
        }
        var aSalePay = this.paymentService.createASalePay(this.sale, this.pos);

        this.paymentService.findASalePayItemsAsync(aSalePay)
            .then(()=> {
                this.aSalePay = aSalePay;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.searchAccounts();

    }

    searchAccounts() {
        if (this.sale.sale.closed) {
            return;
        }
        var accountSearch = new AccountSearch();
        var posRef = new PosRef(this.pos.id);
        accountSearch.posRef = posRef;
        var thisView = this;
        this.accountService.searchAccounts(accountSearch, null)
            .then((result:SearchResult<Account>)=> {
                thisView.allAccounts = result.list;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    startEditPay(account:Account) {
        if (this.editingPayItem != null) {
            this.cancelEditPayItem();
        }
        var payItem:ASalePayItem = new ASalePayItem();
        payItem.aSalePay = this.aSalePay;
        payItem.account = account;
        payItem.amount = 0;


        this.editingPayItem = payItem;
        this.editingPayItem.amount = this.aSalePay.missingAmount;
    }

    startEditPayItem(payItem:ASalePayItem) {
        if (this.editingPayItem != null) {
            this.cancelEditPayItem();
        }
        this.editingPayItem = payItem;
    }

    validatePayAmount(value:string) {
        if (value.length > 0) {
            var floatValue = parseFloat(value);
            if (isNaN(floatValue)) {
                return false;
            }
            return floatValue > 0;
        }
        return true;
    }

    onEditingPayItemChange(event) {
        var amount = parseFloat(event);

        if (!isNaN(amount)) {
            var newItem = this.editingPayItem.accountingEntryId == null;
            if (newItem) {
                this.editingPayItem.amount = amount;
                this.paymentService.createASalePayItem(this.editingPayItem)
                    .catch((error)=> {
                        this.errorService.handleRequestError(error);
                    });
            } else {
                this.paymentService.setASalePayItemAmount(this.editingPayItem, amount)
                    .catch((error)=> {
                        this.errorService.handleRequestError(error);
                    });
            }
        }
        this.cancelEditPayItem();
    }

    cancelEditPayItem() {
        this.editingPayItem = null;
    }

    removePayItem(payItem:ASalePayItem) {
        return this.paymentService.removeASalePayItem(payItem)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onValidateClicked() {
        this.paid.next(true);
        this.editingPayItem = null;
        this.aSalePay = new ASalePay();
    }
}