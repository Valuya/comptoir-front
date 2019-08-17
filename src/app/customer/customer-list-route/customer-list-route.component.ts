import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {concat, Observable, of} from 'rxjs';
import {filter, map, mergeMap, take, toArray} from 'rxjs/operators';
import {TableColumn} from '../../util/table-column';
import {
  CustomerColumn,
  EMAIL_COLUMN,
  FIRST_NAME_COLUMN,
  ID_COLUMN,
  LAST_NAME_COLUMN,
  NOTES_COLUMN,
  PHONE1_COLUMN
} from '../customer-column/customer-columns';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {WsCustomer, WsCustomerSearch, WsCustomerSearchResult, WsEmployee} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';
import {CustomerService} from '../../domain/thirdparty/customer.service';

@Component({
  selector: 'cp-customers-list-route',
  templateUrl: './customer-list-route.component.html',
  styleUrls: ['./customer-list-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerListRouteComponent implements OnInit {

  customersTableHelper: ShellTableHelper<WsCustomer, WsCustomerSearch>;
  selectedCustomers: WsCustomer[] = [];
  columns: TableColumn<CustomerColumn>[] = [
    ID_COLUMN,
    LAST_NAME_COLUMN,
    FIRST_NAME_COLUMN,
    EMAIL_COLUMN,
    PHONE1_COLUMN,
    NOTES_COLUMN
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private customerService: CustomerService,
  ) {
  }

  ngOnInit() {
    this.customersTableHelper = new ShellTableHelper<WsCustomer, WsCustomerSearch>(
      (searchFilter, pagination) => this.searchCustomers$(searchFilter, pagination)
    );
    this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
    ).subscribe(employee => this.initFilter(employee));
  }

  private searchCustomers$(searchFilter: WsCustomerSearch | null, pagination: Pagination | null): Observable<SearchResult<WsCustomer>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.customerService.searchCustomerList$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultCustomers$(results)),
    );
  }

  private searchResultCustomers$(results: WsCustomerSearchResult): Observable<SearchResult<WsCustomer>> {
    const customers$List = results.list.map(ref => this.customerService.getCustomer$(ref));
    return concat(...customers$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsCustomer>;
      })
    );
  }

  private initFilter(employee: WsEmployee) {
    const searchFilter: WsCustomerSearch = {
      companyRef: employee.companyRef
    };
    this.customersTableHelper.setFilter(searchFilter);
  }

  onRowSelect(customer: WsCustomer) {
    this.router.navigate(['/customer', customer.id]);
  }
}
