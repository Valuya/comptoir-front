/**
 * Created by cghislai on 06/08/15.
 */
import {Component} from "angular2/core";
import {Router} from "angular2/router";
import {WsCompanyRef} from "../../../client/domain/company/company";
import {Account} from "../../../domain/accounting/account";
import {SearchResult, SearchRequest} from "../../../client/utils/search";
import {Language} from "../../../client/utils/lang";
import {PaginationFactory, ApplyPageChangeEvent, PageChangeEvent} from "../../../client/utils/pagination";
import {AccountService} from "../../../services/account";
import {ErrorService} from "../../../services/error";
import {AuthService} from "../../../services/auth";
import {PaginatorComponent} from "../../../components/utils/paginator/paginator";
import {AccountListComponent, AccountColumn} from "../../../components/account/list/accountList";
import * as Immutable from "immutable";
import {WsAccountSearch} from "../../../client/domain/search/accountSearch";

@Component({
    templateUrl: './routes/accounts/list/listView.html',
    styleUrls: ['./routes/accounts/list/listView.css'],
    directives: [AccountListComponent, PaginatorComponent]
})

export class AccountsListView {
    accountService:AccountService;
    errorService:ErrorService;
    router:Router;

    searchRequest:SearchRequest<Account>;
    searchResult:SearchResult<Account>;
    columns:Immutable.List<AccountColumn>;
    accountsPerPage:number = 25;

    language:Language;

    constructor(accountService:AccountService, errorService:ErrorService,
                authService:AuthService, router:Router) {
        this.accountService = accountService;
        this.errorService = errorService;
        this.router = router;

        this.searchRequest = new SearchRequest<Account>();
        var accountSearch = new WsAccountSearch();
        accountSearch.companyRef = new WsCompanyRef(authService.auth.employee.company.id);

        var pagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: this.accountsPerPage});
        this.searchRequest.search = accountSearch;
        this.searchRequest.pagination = pagination;
        this.searchResult = new SearchResult<Account>();

        this.language = authService.getEmployeeLanguage();
        this.columns = Immutable.List.of(
            AccountColumn.NAME,
            AccountColumn.DESCRIPTION,
            AccountColumn.TYPE,
            AccountColumn.ACCOUNTING_NUMBER,
            AccountColumn.IBAN,
            AccountColumn.BIC,
            AccountColumn.ACTION_REMOVE
        );
        this.searchAccounts();
    }

    searchAccounts() {
        this.accountService
            .search(this.searchRequest)
            .then((result:SearchResult<Account>)=> {
                this.searchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pageChange:PageChangeEvent) {
        this.searchRequest.pagination = ApplyPageChangeEvent(this.searchRequest.pagination, pageChange);
        this.searchAccounts();
    }

    onColumnAction(event) {
        var account:Account = event.account;
        var column:AccountColumn = event.column;
        if (column === AccountColumn.ACTION_REMOVE) {
            this.doRemoveAccount(account);
        }
    }

    doEditAccount(account:Account) {
        var id = account.id;
        this.router.navigate(['/Accounts/Edit', {id: id}]);
    }

    doRemoveAccount(account:Account) {
        var thisView = this;
        this.accountService
            .remove(account.id)
            .then(()=> {
                thisView.searchAccounts();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }
}
