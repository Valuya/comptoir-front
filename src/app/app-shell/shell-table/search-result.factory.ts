import {SearchResult} from './search-result';

export class SearchResultFactory {
  static emptyResults<T>(): SearchResult<T> {
    return {
      list: [],
      totalCount: 0
    };
  }
}
