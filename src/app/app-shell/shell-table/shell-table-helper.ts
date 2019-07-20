import {Pagination} from '../../util/pagination';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {debounceTime, delay, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {SearchResult} from './search-result';

export class ShellTableHelper<T, F> {

  private search$: (filter: any, pagination: Pagination) => Observable<SearchResult<T>>;

  rows$: Observable<T[]>;
  totalCount$: Observable<number>;
  filter$ = new BehaviorSubject<F | null>(null);
  pagination$ = new BehaviorSubject<Pagination | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);


  constructor(
    search$: (filter: F | null, pagination: Pagination | null) => Observable<SearchResult<T>>,
  ) {
    this.search$ = search$;

    const results$ = combineLatest(this.filter$, this.pagination$).pipe(
      debounceTime(100),
      switchMap(results => this.searchResults$(results[0], results[1])),
      publishReplay(1), refCount()
    );
    this.rows$ = results$.pipe(
      map(r => r.list),
      publishReplay(1), refCount()
    );
    this.totalCount$ = results$.pipe(
      map(r => r.totalCount),
      publishReplay(1), refCount()
    );
  }

  setPagination(pagination: Pagination) {
    this.pagination$.next(pagination);
  }

  setFilter(filter: F) {
    this.filter$.next(filter);
  }

  private searchResults$(filter: F | null, pagination: Pagination | null): Observable<SearchResult<T>> {
    this.loading$.next(true);
    return this.search$(filter, pagination).pipe(
      delay(0),
      tap(() => this.loading$.next(false))
    );
  }
}
