import {TableColumn} from '../../util/table-column';

export const enum StockVariantColumn {
  ID = 'ID',
  STOCK = 'STOCK',
  COMMENT = 'COMMENT',
  END_DATETIME = 'END_DATETIME',
  START_DATETIME = 'START_DATETIME',
  ITEM_VARIANT = 'ITEM_VARIANT',
  ORDER_POSITION = 'ORDER_POSITION',
  PREVIOUS_ITEM = 'PREVIOUS_ITEM',
  QUANTITY = 'QUANTITY',
  STOCK_CHANGE_TYPE = 'STOCK_CHANGE_TYPE',
  SALE_VARIANT = 'SALE_VARIANT',
}

export const ID_COLUMN: TableColumn<StockVariantColumn> = {
  value: StockVariantColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};


export const STOCK_COLUMN: TableColumn<StockVariantColumn> = {
  value: StockVariantColumn.STOCK,
  header: 'Stock',
  sortable: false,
  widthWeight: 1
};

export const COMMENT_COLUMN: TableColumn<StockVariantColumn> = {
  value: StockVariantColumn.COMMENT,
  header: 'Comment',
  sortable: false,
  widthWeight: 1
};

export const END_DATETIME_COLUMN: TableColumn<StockVariantColumn> = {
  value: StockVariantColumn.END_DATETIME,
  header: 'END_DATETIME',
  sortable: false,
  widthWeight: 1
};
export const START_DATETIME_COLUMN: TableColumn<StockVariantColumn> = {
  value: StockVariantColumn.START_DATETIME,
  header: 'START_DATETIME',
  sortable: false,
  widthWeight: 1
};

export const ITEM_VARIANT_COLUMN: TableColumn<StockVariantColumn> = {
  value: StockVariantColumn.ITEM_VARIANT,
  header: 'ITEM_VARIANT',
  sortable: false,
  widthWeight: 1
};

export const ORDER_POSITION_COLUMN: TableColumn<StockVariantColumn> = {
  value: StockVariantColumn.ORDER_POSITION,
  header: 'ORDER_POSITION',
  sortable: false,
  widthWeight: 1
};
export const PREVIOUS_ITEM_COLUMN: TableColumn<StockVariantColumn> = {
  value: StockVariantColumn.PREVIOUS_ITEM,
  header: 'PREVIOUS_ITEM',
  sortable: false,
  widthWeight: 1
};

export const QUANTITY_COLUMN: TableColumn<StockVariantColumn> = {
  value: StockVariantColumn.QUANTITY,
  header: 'Quantity',
  sortable: false,
  widthWeight: 1
};

export const STOCK_CHANGE_TYPE_COLUMN: TableColumn<StockVariantColumn> = {
  value: StockVariantColumn.STOCK_CHANGE_TYPE,
  header: 'STOCK_CHANGE_TYPE',
  sortable: false,
  widthWeight: 1
};

export const SALE_VARIANT_COLUMN: TableColumn<StockVariantColumn> = {
  value: StockVariantColumn.SALE_VARIANT,
  header: 'SALE_VARIANT',
  sortable: false,
  widthWeight: 1
};
