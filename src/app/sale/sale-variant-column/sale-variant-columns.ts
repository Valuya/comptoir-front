import {TableColumn} from '../../util/table-column';

export const enum SaleVariantColumn {
  ID = 'ID',
  SALE = 'SALE',
  STOCK = 'STOCK',
  COMMENT = 'COMMENT',
  DATETIME = 'DATETIME',
  DISCOUNT_RATIO = 'DISCOUNT_RATIO',
  INCLUDE_CUSTOMER_LOYALTY = 'INCLUDE_CUSTOMER_LOYALTY',
  ITEM_VARIANT = 'ITEM_VARIANT',
  QUANTITY = 'QUANTITY',
  TOTAL_VAT_INCLUSIVE = 'TOTAL',
  VAT_EXCLUSIVE = 'VAT_EXCLUSIVE',
  UNIT_VAT_EXCLUSIVE = 'VAT_INCLUSIVE',
  VAT_RATE = 'VAT_RATE',
}

export class SaleVariantColumns {
  static ID_COLUMN: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.ID,
    header: 'Id',
    sortable: false,
    widthWeight: 1
  };


  static SALE_COLUMN: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.SALE,
    header: 'Sale',
    sortable: false,
    widthWeight: 1
  };

  static STOCK_COLUMN: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.STOCK,
    header: 'Stock',
    sortable: false,
    widthWeight: 1
  };

  static COMMENT_COLUMN: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.COMMENT,
    header: 'Comment',
    sortable: false,
    widthWeight: 1
  };

  static DATETIME_COLUMN: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.DATETIME,
    header: 'Datetime',
    sortable: false,
    widthWeight: 1
  };

  static DISCOUNT_RATIO_COLUMN: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.DISCOUNT_RATIO,
    header: 'Discount_ratio',
    sortable: false,
    widthWeight: 1
  };
  static INCLUDE_CUSTOMER_LOYALTY_COLUMN: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.INCLUDE_CUSTOMER_LOYALTY,
    header: 'Include_customer_loyalty',
    sortable: false,
    widthWeight: 1
  };
  static ITEM_VARIANT_COLUMN: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.ITEM_VARIANT,
    header: 'Item_variant',
    sortable: false,
    widthWeight: 1
  };
  static QUANTITY_COLUMN: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.QUANTITY,
    header: 'Quantity',
    sortable: false,
    widthWeight: 1
  };
  static TOTAL_VAT_INCLUSIVE: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.TOTAL_VAT_INCLUSIVE,
    header: 'TOTAL_VAT_INCLUSIVE',
    sortable: false,
    widthWeight: 1
  };

  static VAT_EXCLUSIVE_COLUMN: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.VAT_EXCLUSIVE,
    header: 'Vat_exclusive',
    sortable: false,
    widthWeight: 1
  };
  static UNIT_VAT_EXCLUSIVE: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.UNIT_VAT_EXCLUSIVE,
    header: 'UNIT_VAT_EXCLUSIVE',
    sortable: false,
    widthWeight: 1
  };
  static VAT_RATE_COLUMN: TableColumn<SaleVariantColumn> = {
    value: SaleVariantColumn.VAT_RATE,
    header: 'Vat_rate',
    sortable: false,
    widthWeight: 1
  };
}


