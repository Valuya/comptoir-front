import {SortMeta} from 'primeng/api';

export interface Pagination {
  first: number;
  rows: number;
  multiSortMeta?: SortMeta[];
  globalFilter?: any;
}
