import {TableColumn} from '../../util/table-column';

export const enum AccountingEntryColumn {
  ID = 'ID',
  ACCOUNT = 'ACCOUNT',
  TRANSACTION = 'TRANSACTION',
  AMOUNT = 'AMOUNT',
  CUSTOMER = 'CUSTOMER',
  DATETIME = 'DATETIME',
  DESCRIPTION = 'DESCRIPTION',
  VAT_ENTRY = 'VAT_ENTRY',
  VAT_RATE = 'VAT_RATE',
}

export class AccountingEntryColumns {

  static ID: TableColumn<AccountingEntryColumn> = {
    value: AccountingEntryColumn.ID,
    header: 'Id',
    sortable: false,
    widthWeight: 1
  };

  static ACCOUNT: TableColumn<AccountingEntryColumn> = {
    value: AccountingEntryColumn.ACCOUNT,
    header: 'Account',
    sortable: false,
    widthWeight: 1
  };

  static TRANSACTION: TableColumn<AccountingEntryColumn> = {
    value: AccountingEntryColumn.TRANSACTION,
    header: 'Transaction',
    sortable: false,
    widthWeight: 1
  };

  static AMOUNT: TableColumn<AccountingEntryColumn> = {
    value: AccountingEntryColumn.AMOUNT,
    header: 'AMOUNT',
    sortable: false,
    widthWeight: 1
  };

  static CUSTOMER: TableColumn<AccountingEntryColumn> = {
    value: AccountingEntryColumn.CUSTOMER,
    header: 'Customer',
    sortable: false,
    widthWeight: 1
  };

  static DATETIME: TableColumn<AccountingEntryColumn> = {
    value: AccountingEntryColumn.DATETIME,
    header: 'Date',
    sortable: false,
    widthWeight: 1
  };

  static DESCRIPTION: TableColumn<AccountingEntryColumn> = {
    value: AccountingEntryColumn.DESCRIPTION,
    header: 'DESCRIPTION',
    sortable: false,
    widthWeight: 1
  };

  static VAT_ENTRY: TableColumn<AccountingEntryColumn> = {
    value: AccountingEntryColumn.VAT_ENTRY,
    header: 'VAT entry',
    sortable: false,
    widthWeight: 1
  };

  static VAT_RATE: TableColumn<AccountingEntryColumn> = {
    value: AccountingEntryColumn.VAT_RATE,
    header: 'Vat rate',
    sortable: false,
    widthWeight: 1
  };

}
