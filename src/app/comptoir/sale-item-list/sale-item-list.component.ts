import {ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {WsItemVariantSale, WsItemVariantSaleRef, WsItemVariantSaleSearch} from '@valuya/comptoir-ws-api';
import {Observable, timer} from 'rxjs';
import {PaginationUtils} from '../../util/pagination-utils';
import {LazyLoadEvent, MessageService, SelectItem} from 'primeng/api';
import {DataView} from 'primeng/dataview';
import {SaleVariantColumns} from '../../sale/sale-variant-column/sale-variant-columns';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {WsItemVariantSalePriceDetails} from '@valuya/comptoir-ws-api/dist/models/WsItemVariantSalePriceDetails';
import {VariantSaleWithPrice} from '../../domain/commercial/item-variant-sale/variant-sale-with-price';

@Component({
  selector: 'cp-sale-item-list',
  templateUrl: './sale-item-list.component.html',
  styleUrls: ['./sale-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('highlight', [
      state('highlighted', style({
        backgroundColor: 'transparent',
      })),
      transition('* => highlighted', [
        style({
          backgroundColor: 'yellow',
        }),
        animate(3000, style({
          backgroundColor: 'transparent',
        })),
      ])
    ])
  ]
})
export class SaleItemListComponent implements OnInit {

  itemsTableHelper: ShellTableHelper<VariantSaleWithPrice, WsItemVariantSaleSearch>;

  saleItems$: Observable<VariantSaleWithPrice[]>;
  paginationFirst$: Observable<number>;
  paginationRows$: Observable<number>;
  totalCount$: Observable<number>;
  sortField$: Observable<string>;
  sortOrder$: Observable<1 | -1>;
  loading$: Observable<boolean>;
  viewLayout: 'list' | 'grid' = 'list';

  sortOptions: SelectItem[];
  updatedItem: WsItemVariantSale | null;

  @ViewChild(DataView, {static: false})
  private dataViewChild: DataView;

  constructor(
    private comptoirSaleService: ComptoirSaleService,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.itemsTableHelper = this.comptoirSaleService.getItemsTableHelper();
    this.sortOptions = this.createSortOptions();

    this.saleItems$ = this.comptoirSaleService.getItemWithPrices$();
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


  onSortFieldChange($event: any) {
    console.warn($event);
  }

  onSaleItemUpdate(item: WsItemVariantSale) {
    const ref: WsItemVariantSaleRef = {id: item.id};
    this.comptoirSaleService.udpdateSaleVariant(ref, item);
  }

  onSaleItemPriceUpdate(item: WsItemVariantSale, property: keyof WsItemVariantSalePriceDetails, value: number) {
    const ref: WsItemVariantSaleRef = {id: item.id};
    this.comptoirSaleService.updateSaleVariantPrice(ref, property, value);
  }

  onSaleItemRemove(item: WsItemVariantSale) {
    this.comptoirSaleService.removeVariant({id: item.id});
  }


  scrollToTop() {
    const tableBodyElement = this.getViewContentElement();
    if (tableBodyElement != null) {
      tableBodyElement.scrollTop = 0;
    }
  }

  scrollToBottom() {
    const tableBodyElement = this.getViewContentElement();
    if (tableBodyElement != null) {
      tableBodyElement.scrollTop = tableBodyElement.scrollHeight;
    }
  }


  highlightUpdatedItem(item: WsItemVariantSale) {
    this.updatedItem = item;
    if (item == null) {
      return;
    }
    const tableBodyElement = this.getViewContentElement();
    if (tableBodyElement != null) {
      timer(0).subscribe(() => {
        const itemElements = tableBodyElement.getElementsByClassName(`item-${item.id}`);
        if (itemElements.length > 0) {
          const itemElement = itemElements[0];
          itemElement.scrollIntoView();
        }
      });
    }
  }

  private getViewContentElement() {
    if (this.dataViewChild) {
      const viewElement: HTMLElement = this.dataViewChild.el.nativeElement;
      const tableBodyElements = viewElement.getElementsByClassName('ui-dataview-content');
      if (tableBodyElements.length > 0) {
        return tableBodyElements[0];
      }
    }
    return null;
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

}
