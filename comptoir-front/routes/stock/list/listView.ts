/**
 * Created by cghislai on 06/08/15.
 */
import {Component} from 'angular2/core';
import {NgIf, FORM_DIRECTIVES} from 'angular2/common';
import {Router} from 'angular2/router';


import {Stock} from '../../../domain/stock/stock';
import {Language} from '../../../client/utils/lang';

import {StockService} from '../../../services/stock';
import {ErrorService} from '../../../services/error';
import {AuthService} from '../../../services/auth';
import {PaginationFactory, PageChangeEvent, ApplyPageChangeEvent} from '../../../client/utils/pagination';
import {SearchResult, SearchRequest} from '../../../client/utils/search';

import {Paginator} from '../../../components/utils/paginator/paginator';

import {StockList, StockColumn} from '../../../components/stock/list/stockList';

import * as Immutable from 'immutable';
import {WsStockSearch} from "../../../client/domain/search/stockSearch";

@Component({
    selector: 'stock-list-view',
    templateUrl: './routes/stock/list/listView.html',
    styleUrls: ['./routes/stock/list/listView.css'],
    directives: [NgIf, Paginator, FORM_DIRECTIVES, StockList]
})

export class StockListView {
    stockService:StockService;
    errorService:ErrorService;
    router:Router;

    searchRequest:SearchRequest<Stock>;
    searchResult:SearchResult<Stock>;
    stockPerPage:number = 25;
    columns: Immutable.List<StockColumn>;

    appLanguage:Language;
    loading:boolean;

    constructor(stockService:StockService, appService:ErrorService,
                authService:AuthService, router:Router) {
        this.stockService = stockService;
        this.errorService = appService;
        this.router = router;

        this.searchRequest = new SearchRequest<Stock>();
        var stockSearch = new WsStockSearch();
        stockSearch.companyRef = authService.getEmployeeCompanyRef();
        stockSearch.active = true;
        var pagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: this.stockPerPage});
        this.searchRequest.pagination = pagination;
        this.searchRequest.search = stockSearch;
        this.searchResult = new SearchResult<Stock>();

        this.appLanguage= authService.getEmployeeLanguage();
        this.columns = Immutable.List.of(
            StockColumn.DESCRIPTION,
            StockColumn.ACTION_REMOVE
        );
        this.searchStockList();
    }

    searchStockList() {
        this.stockService
            .search(this.searchRequest)
            .then((result:SearchResult<Stock>) => {
                this.searchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onPageChanged(pageChange:PageChangeEvent) {
        this.searchRequest.pagination = ApplyPageChangeEvent(this.searchRequest.pagination, pageChange);
        this.searchStockList();
    }


    onColumnAction(event) {
        var stock:Stock = event.stock;
        var column:StockColumn= event.column;
        if (column === StockColumn.ACTION_REMOVE) {
            this.doRemoveStock(stock);
        }
    }

    doEditStock(stock:Stock) {
        var id = stock.id;
        this.router.navigate(['/Stock/Edit', {id: id}]);
    }

    doRemoveStock(stock:Stock) {
        var thisView = this;
        this.stockService
            .remove(stock.id)
            .then(function (result) {
                thisView.searchStockList();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }
}
