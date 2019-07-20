import {TableColumn} from '../../util/table-column';

export const enum InvoiceColumn {
  ID = 'ID',
  NUMBER = 'NUMBER',
  NOTES = 'NOTES',
  SALE = 'SALE'
}

export const ID_COLUMN: TableColumn<InvoiceColumn> = {
  value: InvoiceColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};

export const NOTES_COLUMN: TableColumn<InvoiceColumn> = {
  value: InvoiceColumn.NOTES,
  header: 'Notes',
  sortable: false,
  widthWeight: 1
};

export const NUMBER_COLUMN: TableColumn<InvoiceColumn> = {
  value: InvoiceColumn.NUMBER,
  header: 'Number',
  sortable: false,
  widthWeight: 1
};

export const SALE_COLUMN: TableColumn<InvoiceColumn> = {
  value: InvoiceColumn.SALE,
  header: 'Sale',
  sortable: false,
  widthWeight: 1
};
