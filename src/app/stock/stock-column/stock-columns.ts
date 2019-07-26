import {TableColumn} from '../../util/table-column';

export const enum StockColumn {
  ID = 'ID',
  ACTIVE = 'ACTIVE',
  DESCRIPTION = 'DESCRIPTION',
}

export const ID_COLUMN: TableColumn<StockColumn> = {
  value: StockColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};

export const ACTIVE_COLUMN: TableColumn<StockColumn> = {
  value: StockColumn.ACTIVE,
  header: 'Active',
  sortable: false,
  widthWeight: 1
};

export const DESCRIPTION_COLUMN: TableColumn<StockColumn> = {
  value: StockColumn.DESCRIPTION,
  header: 'Description',
  sortable: false,
  widthWeight: 1
};
