import {TableColumn} from '../../util/table-column';

export const enum EmployeeColumn {
  ID = 'ID',
  FIRST_NAME = 'FIRST_NAME',
  LAST_NAME = 'LAST_NAME',
  LOGIN = 'LOGIN',
  LOCALE = 'LOCALE',
  ACTIVE = 'ACTIVE',

}

export const ID_COLUMN: TableColumn<EmployeeColumn> = {
  value: EmployeeColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};

export const FIRST_NAME_COLUMN: TableColumn<EmployeeColumn> = {
  value: EmployeeColumn.FIRST_NAME,
  header: 'First name',
  sortable: false,
  widthWeight: 1
};

export const LAST_NAME_COLUMN: TableColumn<EmployeeColumn> = {
  value: EmployeeColumn.LAST_NAME,
  header: 'Last name',
  sortable: false,
  widthWeight: 1
};

export const LOGIN_COLUMN: TableColumn<EmployeeColumn> = {
  value: EmployeeColumn.LOGIN,
  header: 'Login',
  sortable: false,
  widthWeight: 1
};

export const LOCALE_COLUMN: TableColumn<EmployeeColumn> = {
  value: EmployeeColumn.LOCALE,
  header: 'Locale',
  sortable: false,
  widthWeight: 1
};

export const ACTIVE_COLUMN: TableColumn<EmployeeColumn> = {
  value: EmployeeColumn.ACTIVE,
  header: 'Active',
  sortable: false,
  widthWeight: 1
};
