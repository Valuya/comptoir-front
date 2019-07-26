import {TableColumn} from '../../util/table-column';

export const enum BalanceColumn {
  ID = 'ID',
  ACCOUNT = 'ACCOUNT',
  BALANCE = 'BALANCE',
  CLOSED = 'CLOSED',
  COMMENT = 'COMMENT',
  DATETIME = 'DATETIME',
}

export const ID_COLUMN: TableColumn<BalanceColumn> = {
  value: BalanceColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};

export const ACCOUNT_COLUMN: TableColumn<BalanceColumn> = {
  value: BalanceColumn.ACCOUNT,
  header: 'Account',
  sortable: false,
  widthWeight: 1
};

export const BALANCE_COLUMN: TableColumn<BalanceColumn> = {
  value: BalanceColumn.BALANCE,
  header: 'Balance',
  sortable: false,
  widthWeight: 1
};

export const CLOSED_COLUMN: TableColumn<BalanceColumn> = {
  value: BalanceColumn.CLOSED,
  header: 'Closed',
  sortable: false,
  widthWeight: 1
};

export const COMMENT_COLUMN: TableColumn<BalanceColumn> = {
  value: BalanceColumn.COMMENT,
  header: 'Comment',
  sortable: false,
  widthWeight: 1
};

export const DATETIME_COLUMN: TableColumn<BalanceColumn> = {
  value: BalanceColumn.DATETIME,
  header: 'Datetime',
  sortable: false,
  widthWeight: 1
};
