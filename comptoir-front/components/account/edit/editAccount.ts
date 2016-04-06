/**
 * Created by cghislai on 05/08/15.
 */
import {Component, EventEmitter, OnInit, Input, Output} from "angular2/core";
import {NgFor, NgIf, FORM_DIRECTIVES} from "angular2/common";
import {Account, AccountFactory} from "../../../domain/accounting/account";
import {Language} from "../../../client/utils/lang";
import {AuthService} from "../../../services/auth";
import {AccountService} from "../../../services/account";
import {ErrorService} from "../../../services/error";
import {LangSelectComponent} from "../../lang/langSelect/langSelect";
import {LocalizedInputDirective} from "../../lang/localizedInput/localizedInput";
import {RequiredValidator} from "../../utils/validators";
import {FormMessageComponent} from "../../utils/formMessage/formMessage";
import * as Immutable from "immutable";
import {AccountType, ALL_ACCOUNT_TYPES} from "../../../client/domain/util/accountType";

@Component({
    selector: 'account-edit',
    templateUrl: './components/account/edit/editAccount.html',
    styleUrls: ['./components/account/edit/editAccount.css'],
    directives: [NgFor, NgIf, FORM_DIRECTIVES, LangSelectComponent, LocalizedInputDirective,
        RequiredValidator, FormMessageComponent]
})
export class AccountsEditComponent implements OnInit {
    accountService:AccountService;
    errorService:ErrorService;
    authService:AuthService;

    accountModel:any;
    paymentAccount:boolean;

    editLanguage:Language;
    appLanguage:Language;

    @Input()
    account:Account;

    @Output()
    saved = new EventEmitter();
    @Output()
    cancelled = new EventEmitter();

    allAccountTypes:Immutable.List<AccountType>;

    constructor(accountService:AccountService, authService:AuthService, errorService:ErrorService) {
        this.accountService = accountService;
        this.authService = authService;
        this.errorService = errorService;
        var language = authService.getEmployeeLanguage();
        this.editLanguage = language;
        this.appLanguage = language;
        this.allAccountTypes = Immutable.List(ALL_ACCOUNT_TYPES);
    }

    ngOnInit() {
        this.accountModel = this.account.toJS();
    }

    getAccountTypeLabel(accountType:AccountType) {
        return AccountFactory.getAccountTypeLabel(accountType).get(this.appLanguage.locale);
    }

    isPaymentAccount() {
        return this.accountModel.accountType == AccountType.PAYMENT;
    }


    onFormSubmit() {
        if (!this.isPaymentAccount()) {
            this.accountModel.cash = false;
        }

        var account = AccountFactory.createNewAccount(this.accountModel);
        this.saveAccount(account)
            .then((account)=> {
                this.saved.next(account);
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onCancelClicked() {
        this.cancelled.next(null);
    }

    private saveAccount(account:Account):Promise<Account> {
         return this.accountService.save(account)
            .then((ref)=> {
                return this.accountService.get(ref.id);
            })
            .then((account:Account)=> {
                this.account = account;
                this.accountModel = account.toJS();
                return account;
            });
    }

}
