import {TableColumn} from '../../util/table-column';

export const enum SaleColumn {
  ID = 'ID',
  CUSTOMER = 'CUSTOMER',
  DATETIME = 'DATETIME',
  CLOSED = 'CLOSED',
  VAT_AMOUNT = 'VAT_AMOUNT',
  VAT_EXLUSIVE_AMOUNT = 'VAT_EXLUSIVE_AMOUNT',
  TOTAL_AMOUNT = 'TOTAL_AMOUNT',
  ITEM_COUNT = 'ITEM_COUNT',
  REFERENCE = 'REFERENCE',
  ACTION_JUMP_TO_POS = 'JUMP_TO_POS',
}

export const ID_COLUMN: TableColumn<SaleColumn> = {
  value: SaleColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};

export const CUSTOMER_COLUMN: TableColumn<SaleColumn> = {
  value: SaleColumn.CUSTOMER,
  header: 'Customer',
  sortable: false,
  widthWeight: 1
};

export const CLOSED_COLUMN: TableColumn<SaleColumn> = {
  value: SaleColumn.CLOSED,
  header: 'Closed',
  sortable: false,
  widthWeight: 1
};


export const DATETIME_COLUMN: TableColumn<SaleColumn> = {
  value: SaleColumn.DATETIME,
  header: 'Datetime',
  sortable: false,
  widthWeight: 1
};


export const REFERENCE_COLUMN: TableColumn<SaleColumn> = {
  value: SaleColumn.REFERENCE,
  header: 'Reference',
  sortable: false,
  widthWeight: 1
};

export const VAT_AMOUNT_COLUMN: TableColumn<SaleColumn> = {
  value: SaleColumn.VAT_AMOUNT,
  header: 'VAT Amount',
  sortable: false,
  widthWeight: 1
};

export const VAT_EXCLUSIVE_AMOUNT_COLUMN: TableColumn<SaleColumn> = {
  value: SaleColumn.VAT_EXLUSIVE_AMOUNT,
  header: 'Vat exclusive amount',
  sortable: false,
  widthWeight: 1
};


export const TOTAL_AMOUNT_COLUMN: TableColumn<SaleColumn> = {
  value: SaleColumn.TOTAL_AMOUNT,
  header: 'Total',
  sortable: false,
  widthWeight: 1
};


export const ITEM_COUNT_COLUMN: TableColumn<SaleColumn> = {
  value: SaleColumn.ITEM_COUNT,
  header: 'Items',
  sortable: false,
  widthWeight: 1
};


export const ACTION_JUMP_TO_POS_COLUMN: TableColumn<SaleColumn> = {
  value: SaleColumn.ACTION_JUMP_TO_POS,
  header: '',
  sortable: false,
  widthWeight: 1
};
