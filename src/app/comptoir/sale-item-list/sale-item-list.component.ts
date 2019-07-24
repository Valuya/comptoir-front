import {Component, OnInit} from '@angular/core';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {WsItemVariantSale, WsItemVariantSaleSearch} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Pagination} from '../../util/pagination';
import {PaginationUtils} from '../../util/pagination-utils';
import {LazyLoadEvent, SelectItem} from 'primeng/api';
import {
  DATETIME_COLUMN,
  DISCOUNT_RATIO_COLUMN, INCLUDE_CUSTOMER_LOYALTY_COLUMN,
  ITEM_VARIANT_COLUMN,
  QUANTITY_COLUMN, TOTAL_COLUMN, VAT_RATE_COLUMN
} from '../../sale/sale-variant-column/sale-variant-columns';
import {NAME_COLUMN} from '../../item/item-column/item-columns';

@Component({
  selector: 'cp-sale-item-list',
  templateUrl: './sale-item-list.component.html',
  styleUrls: ['./sale-item-list.component.scss']
})
export class SaleItemListComponent implements OnInit {

  itemsTableHelper: ShellTableHelper<WsItemVariantSale, WsItemVariantSaleSearch>;

  saleItems$: Observable<WsItemVariantSale[]>;
  paginationFirst$: Observable<number>;
  paginationRows$: Observable<number>;
  totalCount$: Observable<number>;
  sortField$: Observable<string>;
  sortOrder$: Observable<1 | -1>;
  loading$: Observable<boolean>;
  viewLayout: 'list' | 'grid' = 'list';

  sortOptions: SelectItem[];

  constructor(
    private comptoirSaleService: ComptoirSaleService
  ) {
  }

  ngOnInit() {
    this.itemsTableHelper = this.comptoirSaleService.getItemsTableHelper();
    this.sortOptions = this.createSortOptions();

    this.saleItems$ = this.itemsTableHelper.rows$;
    this.paginationFirst$ = this.itemsTableHelper.paginationFirst$;
    this.paginationRows$ = this.itemsTableHelper.paginationRows$;
    this.totalCount$ = this.itemsTableHelper.totalCount$;
    this.sortField$ = this.itemsTableHelper.paginationSortField$;
    this.sortOrder$ = this.itemsTableHelper.paginationSortOrder$;
    this.loading$ = this.itemsTableHelper.loading$;

    this.itemsTableHelper.setPagination({
      rows: 100,
      first: 0
    });
  }

  onLazyLoad(event: LazyLoadEvent) {
    const pagination = PaginationUtils.createFromEvent(event);
    this.itemsTableHelper.setPagination(pagination);
  }

  private createSortOptions() {
    return [
      DATETIME_COLUMN,
      ITEM_VARIANT_COLUMN,
      QUANTITY_COLUMN,
      DISCOUNT_RATIO_COLUMN,
      INCLUDE_CUSTOMER_LOYALTY_COLUMN,
      VAT_RATE_COLUMN,
      TOTAL_COLUMN,
    ].map(col => {
      return {
        value: col.value,
        label: col.header,
      } as SelectItem;
    });
  }

  onSortFieldChange($event: any) {
    console.warn($event);
  }
}
