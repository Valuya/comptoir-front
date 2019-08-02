import {LazyLoadEvent, SortMeta} from 'primeng/api';
import {Pagination} from './pagination';

export class PaginationUtils {

  static create(rowsValue = 30): Pagination {
    return {
      first: 0,
      rows: rowsValue
    };
  }

  static createForPage(firstValue: number, rowsValue = 30): Pagination {
    return {
      first: firstValue,
      rows: rowsValue
    };
  }

  static createWithSort(sortField: string | any, sortOrder: 1 | -1 = 1, rowsValue = 30): Pagination {
    return {
      first: 0,
      rows: rowsValue,
      multiSortMeta: [{
        field: sortField,
        order: sortOrder
      }]
    };
  }

  static createFromEvent(event: LazyLoadEvent): Pagination {
    if ( event == null) {
      return null;
    }
    const newPagination = Object.assign({}, {
      first: event.first || 0,
      rows: event.rows,
      multiSortMeta: event.multiSortMeta,
      globalFilter: event.globalFilter
    } as Pagination);
    return newPagination;
  }

  static sortMetaToQueryParam(sorts: SortMeta[]): string {
    if (sorts == null || sorts.length === 0) {
      return null;
    }
    const queryParam = sorts.map(sort => `${sort.field}:${sort.order === 1 ? 'asc' : 'desc'}`)
      .reduce((cur, next) => cur == null ? next : `${cur},${next}`);
    return queryParam;
  }

  static getSingleSortField(pagination: Pagination) {
    if (pagination == null || pagination.multiSortMeta == null || pagination.multiSortMeta.length === 0) {
      return null;
    }
    return pagination.multiSortMeta[0].field;
  }

  static getSingleSortOrder(pagination: Pagination): 1 | -1 {
    if (pagination == null || pagination.multiSortMeta == null || pagination.multiSortMeta.length === 0) {
      return 1;
    }
    return pagination.multiSortMeta[0].order > 0 ? 1 : -1;
  }
}
