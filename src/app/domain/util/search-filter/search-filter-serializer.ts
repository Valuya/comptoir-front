import {SearchFilterQueryParams} from './search-filter-query-param';
import {DateUtils} from '../../../util/date-utils';

export class SearchFilterSerializer {

  static serializeQueryParam<F>(paramValue: any, queryParamName: keyof F | any, target: SearchFilterQueryParams<F>,
                                serializer?: (val: any) => string) {
    if (paramValue == null) {
      return;
    }
    const serialized = serializer == null ? paramValue : serializer(paramValue);
    target[queryParamName] = serialized;
  }

  static deserializeQueryParam<F>(queryParams: SearchFilterQueryParams<F>, queryParamName: keyof F | any,
                                  deserializer?: (val: string) => any): any | undefined {
    if (queryParams == null || queryParamName == null) {
      return undefined;
    }
    const paramValue = queryParams[queryParamName];
    if (paramValue == null) {
      return undefined;
    }

    const deserialized = deserializer == null ? paramValue : deserializer(paramValue);
    return deserialized;
  }


  static serializeDate(date: Date): string {
    return DateUtils.formatDateString(date);
  }

  static serializeBoolean(value: boolean): string {
    return value.toString();
  }

  static serializeRef<R extends { id: number }>(value: R): string {
    const id = value.id;
    return id.toFixed(0);
  }

  static deserializeDate(dateString: string): Date {
    return DateUtils.parseDateString(dateString);
  }

  static deserializeBoolean(value: string): boolean {
    try {
      return JSON.parse(value);
    } catch (e) {
      return null;
    }
  }

  static deserializeRef<R extends { id: number }>(value: string): R {
    const intValue = parseInt(value, 10);
    return {id: intValue} as R;
  }

}
