import {TableColumn} from '../../util/table-column';

export const enum ItemVariantColumn {
  ID = 'ID',
}

export const ID_COLUMN: TableColumn<ItemVariantColumn> = {
  value: ItemVariantColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};
