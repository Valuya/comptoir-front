/**
 * Created by cghislai on 02/08/15.
 */

import {Component} from 'angular2/core';
import {NgIf} from 'angular2/common';

import {WsCompanyRef} from '../../../client/domain/company/company';
import {Balance} from '../../../domain/accounting/balance';
import {PaginationFactory, PageChangeEvent, ApplyPageChangeEvent} from '../../../client/utils/pagination';
import {SearchResult, SearchRequest} from '../../../client/utils/search';

import {AuthService} from '../../../services/auth';
import {ErrorService} from '../../../services/error';
import {BalanceService} from '../../../services/balance';

import {PaginatorComponent} from '../../../components/utils/paginator/paginator';
import {BalanceListComponent, BalanceColumn} from '../../../components/cash/list/balanceList';

import * as Immutable from 'immutable';
import {WsBalanceSearch} from "../../../client/domain/search/balanceSearch";

@Component({
    templateUrl: './routes/cash/history/historyView.html',
    styleUrls: ['./routes/cash/history/historyView.css'],
    directives: [PaginatorComponent, NgIf, BalanceListComponent]
})
export class CashHistoryView {
    balanceService:BalanceService;
    errorService:ErrorService;

    searchRequest:SearchRequest<Balance>;
    searchResult:SearchResult<Balance>;
    itemsPerPage:number = 25;

    columns: Immutable.List<BalanceColumn>;

    constructor(balanceService:BalanceService, errorService:ErrorService, authService:AuthService) {
        this.errorService = errorService;
        this.balanceService = balanceService;

        this.searchRequest = new SearchRequest<Balance>();
        var balanceSearch = new WsBalanceSearch();
        balanceSearch.companyRef = new WsCompanyRef(authService.auth.employee.company.id);
        var pagination = PaginationFactory.Pagination({
            firstIndex: 0,
            pageSize: this.itemsPerPage,
            sorts: {
                'DATETIME': 'desc'
            }
        });
        this.searchRequest.pagination = pagination;
        this.searchRequest.search = balanceSearch;
        this.searchResult = new SearchResult<Balance>();

        this.columns = Immutable.List.of(
            BalanceColumn.DATETIME,
            BalanceColumn.COMMENT,
            BalanceColumn.ACCOUNT,
            BalanceColumn.CLOSED,
            BalanceColumn.BALANCE
        );
        this.searchBalances();
    }

    searchBalances() {
        this.balanceService.search(this.searchRequest)
            .then((result)=> {
                this.searchResult = result;
            })
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pageChange:PageChangeEvent) {
        this.searchRequest.pagination = ApplyPageChangeEvent(this.searchRequest.pagination, pageChange);
        this.searchBalances();
    }


}
