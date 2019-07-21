import {TableColumn} from '../../util/table-column';

export const enum ItemVariantColumn {
  ID = 'ID',
  ITEM = 'ITEM',
  MAIN_PICTURE = 'MAIN_PICTURE',
  PRICING = 'PRICING',
  PRICING_AMOUNT = 'PRICING_AMOUNT',
  VARIANT_REFERENCE = 'VARIANT_REFERENCE',
  ATTRIBUTES = 'ATTRIBUTES',
}

export const ID_COLUMN: TableColumn<ItemVariantColumn> = {
  value: ItemVariantColumn.ID,
  header: 'Id',
  sortable: false,
  widthWeight: 1
};


export const ITEM_COLUMN: TableColumn<ItemVariantColumn> = {
  value: ItemVariantColumn.ITEM,
  header: 'Item',
  sortable: false,
  widthWeight: 1
};

export const MAIN_PICTURE_COLUMN: TableColumn<ItemVariantColumn> = {
  value: ItemVariantColumn.MAIN_PICTURE,
  header: 'Main_picture',
  sortable: false,
  widthWeight: 1
};

export const PRICING_COLUMN: TableColumn<ItemVariantColumn> = {
  value: ItemVariantColumn.PRICING,
  header: 'Pricing',
  sortable: false,
  widthWeight: 1
};

export const PRICING_AMOUNT_COLUMN: TableColumn<ItemVariantColumn> = {
  value: ItemVariantColumn.PRICING_AMOUNT,
  header: 'Pricing_amount',
  sortable: false,
  widthWeight: 1
};

export const VARIANT_REFERENCE_COLUMN: TableColumn<ItemVariantColumn> = {
  value: ItemVariantColumn.VARIANT_REFERENCE,
  header: 'Variant_reference',
  sortable: false,
  widthWeight: 1
};

export const ATTRIBUTES_COLUMN: TableColumn<ItemVariantColumn> = {
  value: ItemVariantColumn.ATTRIBUTES,
  header: 'Attributes',
  sortable: false,
  widthWeight: 1
};
