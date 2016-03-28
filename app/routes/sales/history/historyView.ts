/**
 * Created by cghislai on 31/07/15.
 */
import {Component} from "angular2/core";
import {NgIf, FORM_DIRECTIVES} from "angular2/common";
import {Router} from "angular2/router";
import {LocalSale} from "../../../client/localDomain/sale";
import {LocalSalePrice, LocalSalePriceFactory} from "../../../client/localDomain/salePrice";
import {SaleSearch} from "../../../client/domain/sale";
import {CompanyRef} from "../../../client/domain/company";
import {PaginationFactory, PageChangeEvent, ApplyPageChangeEvent} from "../../../client/utils/pagination";
import {SearchRequest, SearchResult} from "../../../client/utils/search";
import {ErrorService} from "../../../services/error";
import {AuthService} from "../../../services/auth";
import {SaleService} from "../../../services/sale";
import {Paginator} from "../../../components/utils/paginator/paginator";
import {SaleListComponent, SaleColumn} from "../../../components/sales/list/saleList";
import * as Immutable from "immutable";
import {LocalCustomer} from "../../../client/localDomain/customer";
import {CustomerRef} from "../../../client/domain/customer";
import {CustomerSelectInputComponent} from "../../../components/customer/select/customerSelectInput";

@Component({
    selector: 'sales-history-view',
    templateUrl: './routes/sales/history/historyView.html',
    styleUrls: ['./routes/sales/history/historyView.css'],
    directives: [SaleListComponent, NgIf, Paginator,
        FORM_DIRECTIVES,CustomerSelectInputComponent]
})

export class SaleHistoryView {
    saleService:SaleService;
    errorService:ErrorService;
    router:Router;

    searchRequest:SearchRequest<LocalSale>;
    searchResult:SearchResult<LocalSale>;
    totalPayedPrice:LocalSalePrice;

    columns:Immutable.List<SaleColumn>;
    salesPerPage:number = 25;

    loading:boolean;
    fromDateString:string;
    toDateString:string;
    customerSearchCustomer: LocalCustomer;


    constructor(saleService:SaleService, errorService:ErrorService,
                router:Router, authService:AuthService) {
        this.saleService = saleService;
        this.errorService = errorService;
        this.router = router;


        this.searchRequest = new SearchRequest<LocalSale>();
        var saleSearch = new SaleSearch();
        saleSearch.companyRef = new CompanyRef(authService.auth.employee.company.id);
        saleSearch.closed = true;
        this.resetPagination();
        this.searchRequest.search = saleSearch;
        this.searchResult = new SearchResult<LocalSale>();
        this.totalPayedPrice = LocalSalePriceFactory.createNewSalePrice({base: 0, taxes: 0});

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
            .then((result:SearchResult<LocalSale>) => {
                this.searchResult = result;
                return null;
            });
        var payedTask = this.saleService
            .getSalesTotalPayed(this.searchRequest)
            .then((result:LocalSalePrice)=> {
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

    onSaleClicked(sale:LocalSale) {
        var saleId = sale.id;
        this.router.navigate(['/Sales/Details', {id: saleId}]);
    }

    onColumnAction(sale:LocalSale, col:SaleColumn) {
    }

    updateDates() {
        var fromDate = new Date(this.fromDateString);
        this.searchRequest.search.fromDateTime = fromDate;
        var toDate = new Date(this.toDateString);
        this.searchRequest.search.toDateTime = toDate;
    }

    onCustomerSelected(customer:LocalCustomer) {
        this.customerSearchCustomer = customer;
        var customerRef = new CustomerRef(customer.id);
        this.searchRequest.search.customerRef = customerRef;
    }

    onCustomerRemoved() {
        this.searchRequest.search.customerRef = null;
        this.customerSearchCustomer = null;
    }
}
