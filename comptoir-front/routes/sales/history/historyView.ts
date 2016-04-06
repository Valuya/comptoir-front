/**
 * Created by cghislai on 31/07/15.
 */
import {Component} from "angular2/core";
import {NgIf, FORM_DIRECTIVES} from "angular2/common";
import {Router} from "angular2/router";
import {Sale} from "../../../domain/commercial/sale";
import {WsCompanyRef} from "../../../client/domain/company/company";
import {PaginationFactory, PageChangeEvent, ApplyPageChangeEvent} from "../../../client/utils/pagination";
import {SearchRequest, SearchResult} from "../../../client/utils/search";
import {ErrorService} from "../../../services/error";
import {AuthService} from "../../../services/auth";
import {SaleService} from "../../../services/sale";
import {PaginatorComponent} from "../../../components/utils/paginator/paginator";
import {SaleListComponent, SaleColumn} from "../../../components/sale/list/saleList";
import * as Immutable from "immutable";
import {Customer} from "../../../domain/thirdparty/customer";
import {WsCustomerRef} from "../../../client/domain/thirdparty/customer";
import {CustomerSelectComponent} from "../../../components/customer/select/customerSelect";
import {WsSaleSearch} from "../../../client/domain/search/saleSearch";
import {SalePrice, SalePriceFactory} from "../../../domain/commercial/salePrice";

@Component({
    templateUrl: './routes/sales/history/historyView.html',
    styleUrls: ['./routes/sales/history/historyView.css'],
    directives: [SaleListComponent, NgIf, PaginatorComponent,
        FORM_DIRECTIVES, CustomerSelectComponent]
})

export class SaleHistoryView {
    saleService:SaleService;
    errorService:ErrorService;
    router:Router;

    searchRequest:SearchRequest<Sale>;
    searchResult:SearchResult<Sale>;
    totalPayedPrice:SalePrice;

    columns:Immutable.List<SaleColumn>;
    salesPerPage:number = 25;

    loading:boolean;
    fromDateString:string;
    toDateString:string;
    customerSearchCustomer:Customer;


    constructor(saleService:SaleService, errorService:ErrorService,
                router:Router, authService:AuthService) {
        this.saleService = saleService;
        this.errorService = errorService;
        this.router = router;


        this.searchRequest = new SearchRequest<Sale>();
        var saleSearch = new WsSaleSearch();
        saleSearch.companyRef = new WsCompanyRef(authService.auth.employee.company.id);
        saleSearch.closed = true;
        this.resetPagination();
        this.searchRequest.search = saleSearch;
        this.searchResult = new SearchResult<Sale>();
        this.totalPayedPrice = SalePriceFactory.createNewSalePrice({base: 0, taxes: 0});

        this.columns = Immutable.List.of(
            SaleColumn.ID,
            SaleColumn.REFERENCE,
            SaleColumn.DATETIME,
            SaleColumn.CUSTOMER,
            SaleColumn.VAT_EXCLUSIVE_AMOUNT,
            SaleColumn.VAT_AMOUNT,
            SaleColumn.VAT_INCLUSIVE_AMOUNT
        );
        this.searchSales();
    }

    onSearchClicked() {
        this.updateDates();
        this.resetPagination();
        this.searchSales();
    }

    resetPagination() {
        this.searchRequest.pagination = PaginationFactory.Pagination({
            firstIndex: 0,
            pageSize: this.salesPerPage,
            pageIndex: 0,
            sorts: {
                'DATETIME': 'desc'
            }
        });
    }

    searchSales() {
        var saleTask = this.saleService
            .search(this.searchRequest)
            .then((result:SearchResult<Sale>) => {
                this.searchResult = result;
                return null;
            });
        var payedTask = this.saleService
            .getSalesTotalPayed(this.searchRequest)
            .then((result:SalePrice)=> {
                this.totalPayedPrice = result;
                return null;
            });
        return Promise.all([saleTask, payedTask])
            .catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }

    onPageChanged(pageChange:PageChangeEvent) {
        this.searchRequest.pagination = ApplyPageChangeEvent(this.searchRequest.pagination, pageChange);
        this.searchSales();
    }

    onSaleClicked(sale:Sale) {
        var saleId = sale.id;
        this.router.navigate(['/Sales/Details', {id: saleId}]);
    }

    onColumnAction(sale:Sale, col:SaleColumn) {
    }

    updateDates() {
        var fromDate = new Date(this.fromDateString);
        this.searchRequest.search.fromDateTime = fromDate;
        var toDate = new Date(this.toDateString);
        this.searchRequest.search.toDateTime = toDate;
    }

    onCustomerSelected(customer:Customer) {
        this.customerSearchCustomer = customer;
        var customerRef = new WsCustomerRef(customer.id);
        this.searchRequest.search.customerRef = customerRef;
    }

    onCustomerRemoved() {
        this.searchRequest.search.customerRef = null;
        this.customerSearchCustomer = null;
    }
}
