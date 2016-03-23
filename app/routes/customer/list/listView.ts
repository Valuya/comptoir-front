/**
 * Created by cghislai on 06/08/15.
 */
import {Component} from "angular2/core";
import {NgIf, FORM_DIRECTIVES} from "angular2/common";
import {Router} from "angular2/router";
import {CustomerSearch} from "../../../client/domain/customer";
import {LocalCustomer} from "../../../client/localDomain/customer";
import {Language} from "../../../client/utils/lang";
import {CustomerService} from "../../../services/customer";
import {ErrorService} from "../../../services/error";
import {AuthService} from "../../../services/auth";
import {PaginationFactory, PageChangeEvent, ApplyPageChangeEvent} from "../../../client/utils/pagination";
import {SearchResult, SearchRequest} from "../../../client/utils/search";
import {Paginator} from "../../../components/utils/paginator/paginator";
import {CustomerList, CustomerColumn} from "../../../components/customer/list/customerList";
import * as Immutable from "immutable";

@Component({
    selector: 'customer-list-view',
    templateUrl: './routes/customer/list/listView.html',
    styleUrls: ['./routes/customer/list/listView.css'],
    directives: [NgIf, Paginator, FORM_DIRECTIVES, CustomerList]
})

export class CustomerListView {
    customerService:CustomerService;
    errorService:ErrorService;
    router:Router;

    searchRequest:SearchRequest<LocalCustomer>;
    searchResult:SearchResult<LocalCustomer>;
    customerPerPage:number = 25;
    columns: Immutable.List<CustomerColumn>;

    appLanguage:Language;
    loading:boolean;

    constructor(customerService:CustomerService, appService:ErrorService,
                authService:AuthService, router:Router) {
        this.customerService = customerService;
        this.errorService = appService;
        this.router = router;

        this.searchRequest = new SearchRequest<LocalCustomer>();
        var customerSearch = new CustomerSearch();
        customerSearch.companyRef = authService.getEmployeeCompanyRef();
        var pagination = PaginationFactory.Pagination({firstIndex: 0, pageSize: this.customerPerPage});
        this.searchRequest.pagination = pagination;
        this.searchRequest.search = customerSearch;
        this.searchResult = new SearchResult<LocalCustomer>();

        this.appLanguage= authService.getEmployeeLanguage();
        this.columns = Immutable.List.of(
            CustomerColumn.FIRST_NAME,
            CustomerColumn.LAST_NAME,
            CustomerColumn.ZIP,
            CustomerColumn.CITY,
            CustomerColumn.EMAIL,
            CustomerColumn.NOTES
            //CustomerColumn.ACTION_REMOVE // FIXME: implement in backend
        );
        this.searchCustomerList();
    }

    searchCustomerList() {
        this.customerService
            .search(this.searchRequest)
            .then((result:SearchResult<LocalCustomer>) => {
                this.searchResult = result;
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }


    onPageChanged(pageChange:PageChangeEvent) {
        this.searchRequest.pagination = ApplyPageChangeEvent(this.searchRequest.pagination, pageChange);
        this.searchCustomerList();
    }


    onColumnAction(event) {
        var customer:LocalCustomer = event.customer;
        var column:CustomerColumn= event.column;
        if (column === CustomerColumn.ACTION_REMOVE) {
            this.doRemoveCustomer(customer);
        }
    }

    doEditCustomer(customer:LocalCustomer) {
        var id = customer.id;
        this.router.navigate(['/Customer/Edit', {id: id}]);
    }

    doRemoveCustomer(customer:LocalCustomer) {
        var thisView = this;
        this.customerService
            .remove(customer.id)
            .then(function (result) {
                thisView.searchCustomerList();
            }).catch((error)=> {
                this.errorService.handleRequestError(error);
            });
    }
}
