import {Component, OnInit} from '@angular/core';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {WsItemVariantSale, WsItemVariantSaleRef, WsItemVariantSaleSearch} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {PaginationUtils} from '../../util/pagination-utils';
import {LazyLoadEvent, MessageService, SelectItem} from 'primeng/api';
import {SaleVariantColumns} from '../../sale/sale-variant-column/sale-variant-columns';

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
    private comptoirSaleService: ComptoirSaleService,
    private messageService: MessageService,
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
      SaleVariantColumns.DATETIME_COLUMN,
      SaleVariantColumns.ITEM_VARIANT_COLUMN,
      SaleVariantColumns.QUANTITY_COLUMN,
      SaleVariantColumns.DISCOUNT_RATIO_COLUMN,
      SaleVariantColumns.INCLUDE_CUSTOMER_LOYALTY_COLUMN,
      SaleVariantColumns.VAT_RATE_COLUMN,
      SaleVariantColumns.TOTAL_COLUMN,
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

  onSaleItemUpdate(item: WsItemVariantSale) {
    const ref: WsItemVariantSaleRef = {id: item.id};
    this.comptoirSaleService.udpdateSaleVariant(ref, item);
  }

  onSaleitemRemove(item: WsItemVariantSale) {
    this.comptoirSaleService.removeVariant({id: item.id});
  }
}
