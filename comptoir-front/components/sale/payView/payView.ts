/**
 * Created by cghislai on 29/07/15.
 */

import {Component, EventEmitter, ChangeDetectionStrategy, Output, Input} from "angular2/core";
import {NgFor, NgIf} from "angular2/common";
import {Sale} from "../../../domain/commercial/sale";
import {Account} from "../../../domain/accounting/account";
import {AccountingEntry, AccountingEntryFactory} from "../../../domain/accounting/accountingEntry";
import {NumberUtils} from "../../../client/utils/number";
import {LocaleTextsFactory, Language} from "../../../client/utils/lang";
import {ActiveSaleService} from "../../../services/activeSale";
import {ErrorService} from "../../../services/error";
import {AuthService} from "../../../services/auth";
import * as Immutable from "immutable";
import {Stock} from "../../../domain/stock/stock";
import {FastInputDirective} from "../../utils/fastInput";

@Component({
    selector: 'pay-view',
    changeDetection: ChangeDetectionStrategy.Default,
    templateUrl: './components/sale/payView/payView.html',
    styleUrls: ['./components/sale/payView/payView.css'],
    directives: [NgFor, NgIf, FastInputDirective]
})

export class PayView {
    errorService:ErrorService;
    activeSaleService:ActiveSaleService;

    @Input()
    noInput:boolean;
    @Input()
    saleTotal:number;
    @Input()
    paidAmount:number;
    @Input()
    sale:Sale;
    @Input()
    stockList:Immutable.List<Stock>;
    @Input()
    accountingEntries:Immutable.List<AccountingEntry>;

    @Output()
    paid = new EventEmitter();
    @Output()
    details = new EventEmitter();

    editingEntry:AccountingEntry;
    language:Language;
    accountList:Immutable.List<Account>;

    constructor(activeSaleService:ActiveSaleService,
                errorService:ErrorService, authService:AuthService) {
        this.activeSaleService = activeSaleService;
        this.errorService = errorService;

        this.language = authService.getEmployeeLanguage();
        this.fetchAccountList();
    }

    hasSale():boolean {
        return this.sale != null && this.sale.id != null;
    }

    isSearching():boolean {
        return this.activeSaleService.accountingEntriesRequest.busy;
    }

    isEditing(entry:AccountingEntry) {
        return this.editingEntry != null && this.editingEntry.id === entry.id;
    }

    fetchAccountList() {
        this.accountList = this.activeSaleService.accountsResult.list;
        if (this.editingEntry != null) {
            var account = this.editingEntry.account;
            if (!this.accountList.contains(account)) {
                this.cancelEditEntry();
            }
        }
    }


    get toPayAmount() {
        var total = this.saleTotal - this.activeSaleService.paidAmount;
        return NumberUtils.toFixedDecimals(total, 2);
    }


    addAccountingEntry(account:Account) {
        var localAccountingEntryDesc:any = {};
        localAccountingEntryDesc.account = account;
        localAccountingEntryDesc.amount = this.toPayAmount;
        localAccountingEntryDesc.company = account.company;
        localAccountingEntryDesc.accountingTransactionRef = this.sale.accountingTransactionRef;
        localAccountingEntryDesc.customer = this.sale.customer;
        localAccountingEntryDesc.description = LocaleTextsFactory.toLocaleTexts({});
        localAccountingEntryDesc.dateTime = new Date();
        var localAccountingEntry = AccountingEntryFactory.createAccountingEntry(localAccountingEntryDesc);
        this.startEditEntry(localAccountingEntry);
    }

    startEditEntry(localAccountingEntry:AccountingEntry) {
        if (this.editingEntry != null) {
            this.cancelEditEntry();
        }
        if (localAccountingEntry.amount == null || localAccountingEntry.amount <= 0) {
            this.editingEntry = <AccountingEntry>localAccountingEntry.set('amount', this.toPayAmount);
        } else {
            this.editingEntry = localAccountingEntry;
        }
    }

    validateEntryAmount(value:string) {
        if (value.length > 0) {
            var floatValue = parseFloat(value);
            if (isNaN(floatValue)) {
                return false;
            }
            return floatValue > 0;
        }
        return true;
    }

    applyEditingEntry(event) {
        var amount = parseFloat(event);
        if (isNaN(amount)) {
            this.cancelEditEntry();
            return;
        }
        amount = NumberUtils.toFixedDecimals(amount, 2);
        var entry = <AccountingEntry>this.editingEntry.set('amount', amount);

        this.activeSaleService.doAddAccountingEntry(entry)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
        this.cancelEditEntry();
    }

    cancelEditEntry() {
        this.editingEntry = null;
    }

    removeEntry(entry:AccountingEntry) {
        return this.activeSaleService.doRemoveAccountingEntry(entry)
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onValidateClicked() {
        this.cancelEditEntry();
        this.activeSaleService.doCloseSale()
            .then(()=> {
                this.paid.emit(true);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    isConfirmationRequired() {
        return true;
    }

    onConfirmationClicked() {
        this.cancelEditEntry();
        this.details.emit(null);
    }

}