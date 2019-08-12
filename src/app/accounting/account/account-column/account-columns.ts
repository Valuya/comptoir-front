import {TableColumn} from '../../../util/table-column';

export const enum AccountColumn {
  ID = 'ID',
  ACCOUNT_TYPE = 'ACCOUNT_TYPE',
  ACCOUNTING_NUMBER = 'ACCOUNTING_NUMBER',
  BIC = 'BIC',
  CASH = 'CASH',
  COMPANY = 'COMPANY',
  DESCRIPTION = 'DESCRIPTION',
  IBAN = 'IBAN',
  NAME = 'NAME',
}

export const ID_COLUMN: TableColumn<AccountColumn> = {
  value: AccountColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};

export const ACCOUNT_TYPE_COLUMN: TableColumn<AccountColumn> = {
  value: AccountColumn.ACCOUNT_TYPE,
  header: 'Account type',
  sortable: false,
  widthWeight: 1
};

export const ACCOUNTING_NUMBER_COLUMN: TableColumn<AccountColumn> = {
  value: AccountColumn.ACCOUNTING_NUMBER,
  header: 'Accounting number',
  sortable: false,
  widthWeight: 1
};

export const BIC_COLUMN: TableColumn<AccountColumn> = {
  value: AccountColumn.BIC,
  header: 'BIC',
  sortable: false,
  widthWeight: 1
};

export const CASH_COLUMN: TableColumn<AccountColumn> = {
  value: AccountColumn.CASH,
  header: 'Cash',
  sortable: false,
  widthWeight: 1
};

export const COMPANY_COLUMN: TableColumn<AccountColumn> = {
  value: AccountColumn.COMPANY,
  header: 'Company',
  sortable: false,
  widthWeight: 1
};

export const DESCRIPTION_COLUMN: TableColumn<AccountColumn> = {
  value: AccountColumn.DESCRIPTION,
  header: 'Description',
  sortable: false,
  widthWeight: 1
};

export const IBAN_COLUMN: TableColumn<AccountColumn> = {
  value: AccountColumn.IBAN,
  header: 'Iban',
  sortable: false,
  widthWeight: 1
};

export const NAME_COLUMN: TableColumn<AccountColumn> = {
  value: AccountColumn.NAME,
  header: 'Name',
  sortable: false,
  widthWeight: 1
};
