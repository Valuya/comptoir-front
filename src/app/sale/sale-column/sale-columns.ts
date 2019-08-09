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

export class SaleColumns {

  static ID_COLUMN: TableColumn<SaleColumn> = {
    value: SaleColumn.ID,
    header: 'Id',
    sortable: false,
    widthWeight: 1
  };

  static CUSTOMER_COLUMN: TableColumn<SaleColumn> = {
    value: SaleColumn.CUSTOMER,
    header: 'Customer',
    sortable: false,
    widthWeight: 1
  };

  static CLOSED_COLUMN: TableColumn<SaleColumn> = {
    value: SaleColumn.CLOSED,
    header: 'Closed',
    sortable: false,
    widthWeight: 1
  };


  static DATETIME_COLUMN: TableColumn<SaleColumn> = {
    value: SaleColumn.DATETIME,
    header: 'Datetime',
    sortable: false,
    widthWeight: 1
  };


  static REFERENCE_COLUMN: TableColumn<SaleColumn> = {
    value: SaleColumn.REFERENCE,
    header: 'Reference',
    sortable: false,
    widthWeight: 1
  };

  static VAT_AMOUNT_COLUMN: TableColumn<SaleColumn> = {
    value: SaleColumn.VAT_AMOUNT,
    header: 'VAT Amount',
    sortable: false,
    widthWeight: 1
  };

  static VAT_EXCLUSIVE_AMOUNT_COLUMN: TableColumn<SaleColumn> = {
    value: SaleColumn.VAT_EXLUSIVE_AMOUNT,
    header: 'Vat exclusive amount',
    sortable: false,
    widthWeight: 1
  };


  static TOTAL_AMOUNT_COLUMN: TableColumn<SaleColumn> = {
    value: SaleColumn.TOTAL_AMOUNT,
    header: 'Total',
    sortable: false,
    widthWeight: 1
  };


  static ITEM_COUNT_COLUMN: TableColumn<SaleColumn> = {
    value: SaleColumn.ITEM_COUNT,
    header: 'Items',
    sortable: false,
    widthWeight: 1
  };


  static ACTION_JUMP_TO_POS_COLUMN: TableColumn<SaleColumn> = {
    value: SaleColumn.ACTION_JUMP_TO_POS,
    header: '',
    sortable: false,
    widthWeight: 1
  };

}
