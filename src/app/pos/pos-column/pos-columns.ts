import {TableColumn} from '../../util/table-column';

export const enum PosColumn {
  ID = 'ID',
  DEFAULT_CUSTOMER = 'DEFAULT_CUSTOMER',
  DESCRIPTION = 'DESCRIPTION',
  NAME = 'NAME',
}

export const ID_COLUMN: TableColumn<PosColumn> = {
  value: PosColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};

export const DESCRIPTION_COLUMN: TableColumn<PosColumn> = {
  value: PosColumn.DESCRIPTION,
  header: 'Description',
  sortable: false,
  widthWeight: 1
};

export const NAME_COLUMN: TableColumn<PosColumn> = {
  value: PosColumn.NAME,
  header: 'Name',
  sortable: false,
  widthWeight: 1
};
export const DEFAULT_CUSTOMER_COLUMN: TableColumn<PosColumn> = {
  value: PosColumn.DEFAULT_CUSTOMER,
  header: 'Default customer',
  sortable: false,
  widthWeight: 1
};
