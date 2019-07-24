import {SearchResult} from './search-result';

export class SearchResultFactory {
  static emptyResults<T>(): SearchResult<T> {
    return {
      list: [],
      totalCount: 0
    };
  }

  static create<T>(listValue: T[], count: number): SearchResult<T> {
    return {
      list: listValue,
      totalCount: count
    };
  }
}
