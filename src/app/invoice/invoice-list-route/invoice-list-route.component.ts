import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {concat, Observable, of} from 'rxjs';
import {filter, map, mergeMap, take, toArray} from 'rxjs/operators';
import {TableColumn} from '../../util/table-column';
import {ID_COLUMN, InvoiceColumn, NOTES_COLUMN, NUMBER_COLUMN, SALE_COLUMN} from '../invoice-column/invoice-columns';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {WsEmployee, WsInvoice, WsInvoiceSearch, WsInvoiceSearchResult} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';
import {InvoiceService} from '../../domain/commercial/invoice.service';

@Component({
  selector: 'cp-invoices-list-route',
  templateUrl: './invoice-list-route.component.html',
  styleUrls: ['./invoice-list-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceListRouteComponent implements OnInit {

  invoicesTableHelper: ShellTableHelper<WsInvoice, WsInvoiceSearch>;
  selectedInvoices: WsInvoice[] = [];
  columns: TableColumn<InvoiceColumn>[] = [
    ID_COLUMN,
    NUMBER_COLUMN,
    NOTES_COLUMN,
    SALE_COLUMN,
  ];

  constructor(private invoiceService: InvoiceService,
              private authService: AuthService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.invoicesTableHelper = new ShellTableHelper<WsInvoice, WsInvoiceSearch>(
      (searchFilter, pagination) => this.searchInvoices$(searchFilter, pagination)
    );
    this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
    ).subscribe(employee => this.initFilter(employee));
  }

  private searchInvoices$(searchFilter: WsInvoiceSearch | null, pagination: Pagination | null): Observable<SearchResult<WsInvoice>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.invoiceService.searchInvoiceList$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultInvoices$(results)),
    );
  }

  private searchResultInvoices$(results: WsInvoiceSearchResult): Observable<SearchResult<WsInvoice>> {
    const invoices$List = results.list.map(ref => this.invoiceService.getInvoice$(ref));
    return concat(...invoices$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsInvoice>;
      })
    );
  }

  private initFilter(employee: WsEmployee) {
    const searchFilter: WsInvoiceSearch = {
      companyRef: employee.companyRef
    };
    this.invoicesTableHelper.setFilter(searchFilter);
  }

  onRowSelect(invoice: WsInvoice) {
    this.router.navigate(['/invoice', invoice.id]);
  }
}
