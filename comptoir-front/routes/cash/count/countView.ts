/**
 * Created by cghislai on 02/08/15.
 */
import {Component} from "angular2/core";
import {NgIf, NgFor} from "angular2/common";
import {CanReuse, OnReuse, OnActivate, Router} from "angular2/router";
import {LocalAccount} from "../../../domain/account";
import {LocalBalance} from "../../../domain/balance";
import {WsPos, WsPosRef} from "../../../client/domain/commercial/pos";
import {SearchRequest, SearchResult} from "../../../client/utils/search";
import {Language} from "../../../client/utils/lang";
import {PaginationFactory} from "../../../client/utils/pagination";
import {BalanceService} from "../../../services/balance";
import {PosService} from "../../../services/pos";
import {AccountService} from "../../../services/account";
import {ErrorService} from "../../../services/error";
import {AuthService} from "../../../services/auth";
import {PosSelect} from "../../../components/pos/posSelect/posSelect";
import {BalanceCountComponent} from "../../../components/cash/balance/countComponent";
import {WsAccountSearch} from "../../../client/domain/search/accountSearch";
import {AccountType} from "../../../client/domain/util/accountType";
import {WsBalanceSearch} from "../../../client/domain/search/balanceSearch";
import {WsAccountRef} from "../../../client/domain/accounting/account";

@Component({
    selector: 'count-cash-view',
    templateUrl: './routes/cash/count/countView.html',
    styleUrls: ['./routes/cash/count/countView.css'],
    directives: [NgIf, NgFor, PosSelect, BalanceCountComponent]
})

export class CountCashView implements CanReuse, OnReuse, OnActivate {
    balanceService:BalanceService;
    posService:PosService;
    accountService:AccountService;
    errorService:ErrorService;
    authService:AuthService;

    pos:WsPos;

    accountSearchRequest:SearchRequest<LocalAccount>;
    accountSearchResult:SearchResult<LocalAccount>;
    paymentAccountList:Immutable.List<LocalAccount>;
    account:LocalAccount;
    accountId:number;

    balanceSearchRequest:SearchRequest<LocalBalance>;
    balanceSearchResult:SearchResult<LocalBalance>;
    lastBalance:LocalBalance;

    appLanguage:Language;
    router:Router;

    constructor(errorService:ErrorService, balanceService:BalanceService,
                posService:PosService, accountService:AccountService, authService:AuthService,
                router:Router) {
        this.balanceService = balanceService;
        this.posService = posService;
        this.accountService = accountService;
        this.errorService = errorService;
        this.authService = authService;
        this.router = router;

        this.accountSearchRequest = new SearchRequest<LocalAccount>();
        this.accountSearchResult = new SearchResult<LocalAccount>();
        this.balanceSearchRequest = new SearchRequest<LocalBalance>();
        this.balanceSearchResult = new SearchResult<LocalBalance>();

        this.appLanguage = authService.getEmployeeLanguage();
        this.accountId = null;
    }

    routerCanReuse() {
        return true;
    }

    routerOnReuse() {
        this.searchPaymentAccounts();
    }
    routerOnActivate() {
        this.searchPaymentAccounts();
    }

    searchPaymentAccounts():Promise<any> {
        var accountSearch = new WsAccountSearch();
        accountSearch.type = AccountType[AccountType.PAYMENT];
        if (this.pos != null) {
            accountSearch.posRef = new WsPosRef(this.pos.id);
        }
        accountSearch.cash = true;
        accountSearch.type = AccountType[AccountType.PAYMENT];
        accountSearch.companyRef = this.authService.getEmployeeCompanyRef();
        this.accountSearchRequest.search = accountSearch;

        this.accountSearchResult = null;
        this.paymentAccountList = null;
        this.accountId = null;
        this.account = null;
        this.lastBalance = null;

        return this.accountService.search(this.accountSearchRequest)
            .then((result:SearchResult<LocalAccount>)=> {
                this.accountSearchResult = result;
                this.paymentAccountList = result.list;
                if (this.account == null && this.paymentAccountList.size === 1) {
                    this.setAccount(this.paymentAccountList.get(0));
                } else if (this.account != null) {
                    this.searchLastBalance();
                }
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPosChanged(pos:WsPos) {
        if (this.pos == pos) {
            return;
        }
        this.pos = pos;
        this.searchPaymentAccounts();
    }


    setAccount(account:LocalAccount) {
        this.account = account;
        if (account == null) {
            return;
        }
        this.accountService.lastUsedBalanceAccount = account;
        if (account == null) {
            this.accountId = null;
            return;
        }
        this.accountId = account.id;
        this.searchLastBalance();
    }


    onAccountChanged(event) {
        var accountId = parseInt(event.target.value);
        if (this.accountSearchResult == null) {
            return;
        }
        var account = this.accountSearchResult.list
            .find((account)=> {
                return account.id === accountId;
            });
        this.setAccount(account);
    }

    searchLastBalance() {
        if (this.account == null) {
            return;
        }
        var balanceSearch = new WsBalanceSearch();
        balanceSearch.accountSearch = this.accountSearchRequest.search;
        balanceSearch.companyRef = this.authService.getEmployeeCompanyRef();
        balanceSearch.closed = true;
        balanceSearch.accountRef = new WsAccountRef(this.account.id);
        var pagination = PaginationFactory.Pagination({
            firstIndex: 0,
            pageSize: 1,
            sorts: {'DATETIME': 'desc'}
        });
        this.balanceSearchRequest.search = balanceSearch;
        this.balanceSearchRequest.pagination = pagination;
        this.balanceService.search(this.balanceSearchRequest)
            .then((result:SearchResult<LocalBalance>)=> {
                this.balanceSearchResult = result;
                this.lastBalance = result.list.first();
            }).catch((error)=> {
            this.errorService.handleRequestError(error);
        });
    }

    onBalanceValidated(balance) {
        this.searchLastBalance();
    }

    onBalanceCancelled() {
    }
}
