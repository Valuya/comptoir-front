import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {combineLatest, Observable, of, Subscription} from 'rxjs';
import {WsCompanyRef, WsSaleRef, WsSaleSearch} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {filter, map} from 'rxjs/operators';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {PaginationUtils} from '../../util/pagination-utils';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {LazyLoadEvent, SelectItem} from 'primeng/api';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';

import {DATETIME_COLUMN} from '../../sale/sale-column/sale-columns';
import {SaleService} from '../../domain/commercial/sale.service';
import {ID_COLUMN} from '../../sale/sale-variant-column/sale-variant-columns';
import {ComptoirService} from '../comptoir-service';
import {ComptoirSaleService} from '../comptoir-sale.service';

@Component({
  selector: 'cp-sale-select-list',
  templateUrl: './sale-select-list.component.html',
  styleUrls: ['./sale-select-list.component.scss']
})
export class SaleSelectListComponent implements OnInit, OnDestroy {

  @Input()
  viewLayout: 'list' | 'grid' = 'list';
  @Input()
  autoSelectSingleSale = true;
  @Input()
  noDebounce: boolean;

  @Output()
  saleSelect = new EventEmitter<WsSaleRef>();

  tableHelper: ShellTableHelper<WsSaleRef, WsSaleSearch>;

  sortOptions: SelectItem[];

  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private comptoirService: ComptoirSaleService,
  ) {
  }

  ngOnInit() {
    this.subscription = new Subscription();
    this.tableHelper = new ShellTableHelper<WsSaleRef, WsSaleSearch>(
      (searchFilter, pagination) => this.searchSales$(),
      {
        noDebounce: this.noDebounce
      }
    );
    this.sortOptions = this.createSortOptions();
    this.tableHelper.setPagination(PaginationUtils.createWithSort(
      DATETIME_COLUMN.value, -1
    ));

    const singleSubscription = this.tableHelper.results$.pipe(
      filter(results => results.totalCount === 1 && results.list.length === 1),
      map(results => results.list[0]),
      filter(() => this.autoSelectSingleSale)
    ).subscribe(singleResult => this.onSaleClick(singleResult));
    this.subscription.add(singleSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLazyLoad(event: LazyLoadEvent) {
    const pagination = PaginationUtils.createFromEvent(event);
    this.tableHelper.setPagination(pagination);
  }

  onSortFieldChange($event: any) {
  }

  onSaleClick(ref: WsSaleRef) {
    this.saleSelect.emit(ref);
  }


  private searchSales$(): Observable<SearchResult<WsSaleRef>> {
    return this.comptoirService.listOpenSales$();
  }

  private createSortOptions() {
    return [
      DATETIME_COLUMN,
      ID_COLUMN
    ].map(col => {
      return {
        value: col.value,
        label: col.header,
      } as SelectItem;
    });
  }

}
