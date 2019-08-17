import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {WsSaleRef, WsSaleSearch} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {filter, map} from 'rxjs/operators';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {PaginationUtils} from '../../util/pagination-utils';
import {LazyLoadEvent, SelectItem} from 'primeng/api';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {SaleColumns} from '../../sale/sale-column/sale-columns';

@Component({
  selector: 'cp-sale-select-list',
  templateUrl: './sale-select-list.component.html',
  styleUrls: ['./sale-select-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    private saleService: ComptoirSaleService,
  ) {
  }

  ngOnInit() {
    this.subscription = new Subscription();
    this.tableHelper = new ShellTableHelper<WsSaleRef, WsSaleSearch>(
      (searchFilter, pagination) => this.saleService.getOpenSales$(),
      {
        noDebounce: this.noDebounce,
        ignorePagination: true,
        ignoreFilter: true,
      }
    );
    this.sortOptions = this.createSortOptions();
    this.tableHelper.setPagination(PaginationUtils.createWithSort(
      SaleColumns.DATETIME_COLUMN.value, -1
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

  onSaleClick(ref: WsSaleRef) {
    this.saleSelect.emit(ref);
  }


  private createSortOptions() {
    return [
      SaleColumns.DATETIME_COLUMN,
      SaleColumns.ID_COLUMN
    ].map(col => {
      return {
        value: col.value,
        label: col.header,
      } as SelectItem;
    });
  }

}
