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
  TOTAL = 'TOTAL',
  VAT_EXCLUSIVE = 'VAT_EXCLUSIVE',
  VAT_RATE = 'VAT_RATE',
}

export const ID_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};


export const SALE_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.SALE,
  header: 'Sale',
  sortable: false,
  widthWeight: 1
};

export const STOCK_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.STOCK,
  header: 'Stock',
  sortable: false,
  widthWeight: 1
};

export const COMMENT_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.COMMENT,
  header: 'Comment',
  sortable: false,
  widthWeight: 1
};

export const DATETIME_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.DATETIME,
  header: 'Datetime',
  sortable: false,
  widthWeight: 1
};

export const DISCOUNT_RATIO_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.DISCOUNT_RATIO,
  header: 'Discount_ratio',
  sortable: false,
  widthWeight: 1
};
export const INCLUDE_CUSTOMER_LOYALTY_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.INCLUDE_CUSTOMER_LOYALTY,
  header: 'Include_customer_loyalty',
  sortable: false,
  widthWeight: 1
};
export const ITEM_VARIANT_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.ITEM_VARIANT,
  header: 'Item_variant',
  sortable: false,
  widthWeight: 1
};
export const QUANTITY_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.QUANTITY,
  header: 'Quantity',
  sortable: false,
  widthWeight: 1
};
export const TOTAL_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.TOTAL,
  header: 'Total',
  sortable: false,
  widthWeight: 1
};

export const VAT_EXCLUSIVE_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.VAT_EXCLUSIVE,
  header: 'Vat_exclusive',
  sortable: false,
  widthWeight: 1
};
export const VAT_RATE_COLUMN: TableColumn<SaleVariantColumn> = {
  value: SaleVariantColumn.VAT_RATE,
  header: 'Vat_rate',
  sortable: false,
  widthWeight: 1
};
