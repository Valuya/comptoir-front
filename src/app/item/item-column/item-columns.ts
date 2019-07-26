import {TableColumn} from '../../util/table-column';

export const enum ItemColumn {
  ID = 'ID',
  DESCRIPTION = 'DESCRIPTION',
  MAIN_PICTURE = 'MAIN_PICTURE',
  MULTIPLE_SALE = 'MULTIPLE_SALE',
  NAME = 'NAME',
  REFERENCE = 'REFERENCE',
  VAT_EXCLUSIVE = 'VAT_EXCLUSIVE',
  VAT_RATE = 'VAT_RATE',
}

export const ID_COLUMN: TableColumn<ItemColumn> = {
  value: ItemColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};

export const DESCRIPTION_COLUMN: TableColumn<ItemColumn> = {
  value: ItemColumn.DESCRIPTION,
  header: 'Description',
  sortable: false,
  widthWeight: 1
};

export const MAIN_PICTURE_COLUMN: TableColumn<ItemColumn> = {
  value: ItemColumn.MAIN_PICTURE,
  header: 'Main_picture',
  sortable: false,
  widthWeight: 1
};

export const NAME_COLUMN: TableColumn<ItemColumn> = {
  value: ItemColumn.NAME,
  header: 'Name',
  sortable: false,
  widthWeight: 1
};

export const MULTIPLE_SALE_COLUMN: TableColumn<ItemColumn> = {
  value: ItemColumn.MULTIPLE_SALE,
  header: 'Multiple_sale',
  sortable: false,
  widthWeight: 1
};

export const REFERENCE_COLUMN: TableColumn<ItemColumn> = {
  value: ItemColumn.REFERENCE,
  header: 'Reference',
  sortable: false,
  widthWeight: 1
};

export const VAT_EXCLUSIVE_COLUMN: TableColumn<ItemColumn> = {
  value: ItemColumn.VAT_EXCLUSIVE,
  header: 'Vat_exclusive',
  sortable: false,
  widthWeight: 1
};

export const VAT_RATE_COLUMN: TableColumn<ItemColumn> = {
  value: ItemColumn.VAT_RATE,
  header: 'Vat_rate',
  sortable: false,
  widthWeight: 1
};
