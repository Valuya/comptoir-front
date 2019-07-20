import {TableColumn} from '../../util/table-column';

export const enum CustomerColumn {
  ID = 'ID',
  FIRST_NAME = 'FIRST_NAME',
  LAST_NAME = 'LAST_NAME',
  EMAIL = 'EMAIL',
  PHONE1 = 'PHONE1',
  NOTES = 'NOTES',
}

export const ID_COLUMN: TableColumn<CustomerColumn> = {
  value: CustomerColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};

export const FIRST_NAME_COLUMN: TableColumn<CustomerColumn> = {
  value: CustomerColumn.FIRST_NAME,
  header: 'First name',
  sortable: false,
  widthWeight: 1
};

export const LAST_NAME_COLUMN: TableColumn<CustomerColumn> = {
  value: CustomerColumn.LAST_NAME,
  header: 'Last name',
  sortable: false,
  widthWeight: 1
};

export const EMAIL_COLUMN: TableColumn<CustomerColumn> = {
  value: CustomerColumn.EMAIL,
  header: 'Email',
  sortable: false,
  widthWeight: 1
};

export const PHONE1_COLUMN: TableColumn<CustomerColumn> = {
  value: CustomerColumn.PHONE1,
  header: 'Phone 1',
  sortable: false,
  widthWeight: 1
};

export const NOTES_COLUMN: TableColumn<CustomerColumn> = {
  value: CustomerColumn.NOTES,
  header: 'Notes',
  sortable: false,
  widthWeight: 1
};
