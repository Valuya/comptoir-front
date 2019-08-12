import {WsSaleSearch} from '@valuya/comptoir-ws-api';
import {DateUtils} from '../util/date-utils';

export type SearchFilterQueryParams = {
  [key in keyof WsSaleSearch]?: string | number | boolean
};

export class SaleSearchFilterUtils {

  static serializeFilter(searchFilter: Partial<WsSaleSearch>): SearchFilterQueryParams {
    const queryParamsValue: SearchFilterQueryParams = {};

    if (searchFilter.closed != null) {
      queryParamsValue.closed = searchFilter.closed;
    }
    if (searchFilter.toDateTime != null) {
      queryParamsValue.toDateTime = DateUtils.formatDateString(searchFilter.toDateTime);
    }
    if (searchFilter.fromDateTime != null) {
      queryParamsValue.fromDateTime = DateUtils.formatDateString(searchFilter.fromDateTime);
    }
    if (searchFilter.customerRef != null) {
      queryParamsValue.customerRef = searchFilter.customerRef.id;
    }
    return queryParamsValue;
  }

  static deserializeFilter(queryParams: SearchFilterQueryParams): WsSaleSearch {
    const searchFilter: WsSaleSearch = {} as WsSaleSearch;

    if (queryParams.closed != null) {
      searchFilter.closed = queryParams.closed === 'true';
    }
    if (queryParams.toDateTime != null) {
      searchFilter.toDateTime = DateUtils.parseDateString(queryParams.toDateTime as string);
    }
    if (queryParams.fromDateTime != null) {
      searchFilter.fromDateTime = DateUtils.parseDateString(queryParams.fromDateTime as string);
    }
    if (queryParams.customerRef != null) {
      searchFilter.customerRef = {
        id: queryParams.customerRef as number
      };
    }
    return searchFilter;
  }

}
