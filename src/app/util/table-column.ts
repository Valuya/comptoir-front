export interface TableColumn<T> {
  value: T;
  header: string;
  sortable: boolean;
  widthWeight: number;
}
