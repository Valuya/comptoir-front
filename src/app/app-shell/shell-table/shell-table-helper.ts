import {Pagination} from '../../util/pagination';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {debounceTime, delay, map, publishReplay, refCount, switchMap, take, tap} from 'rxjs/operators';
import {SearchResult} from './search-result';
import {PaginationUtils} from '../../util/pagination-utils';

export class ShellTableHelper<T, F> {

  private search$: (filter: any, pagination: Pagination) => Observable<SearchResult<T>>;

  filter$ = new BehaviorSubject<F | null>(null);
  pagination$ = new BehaviorSubject<Pagination | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);

  results$: Observable<SearchResult<T>>;
  rows$: Observable<T[]>;
  totalCount$: Observable<number>;
  paginationFirst$: Observable<number>;
  paginationRows$: Observable<number>;
  paginationSortField$: Observable<string>;
  paginationSortOrder$: Observable<1 | -1>;

  constructor(
    search$: (filter: F | null, pagination: Pagination | null) => Observable<SearchResult<T>>,
  ) {
    this.search$ = search$;
    this.initResults();
  }

  setFilter(filter: F) {
    this.filter$.next(filter);
  }

  setPagination(pagination: Pagination) {
    this.pagination$.next(pagination);
  }

  reload() {
    this.pagination$.pipe(
      take(1),
    ).subscribe(p => this.pagination$.next(p));
  }

  private initResults() {
    this.results$ = combineLatest(this.filter$, this.pagination$).pipe(
      debounceTime(100),
      switchMap(results => this.searchResults$(results[0], results[1])),
      publishReplay(1), refCount()
    );
    this.rows$ = this.results$.pipe(
      map(r => r.list),
      publishReplay(1), refCount()
    );
    this.totalCount$ = this.results$.pipe(
      map(r => r.totalCount),
      publishReplay(1), refCount()
    );
    this.paginationFirst$ = this.pagination$.pipe(
      map(p => p == null ? 0 : p.first),
      publishReplay(1), refCount()
    );
    this.paginationRows$ = this.pagination$.pipe(
      map(p => p == null ? 0 : p.rows),
      publishReplay(1), refCount()
    );
    this.paginationSortField$ = this.pagination$.pipe(
      delay(0),
      map(p => PaginationUtils.getSingleSortField(p)),
      publishReplay(1), refCount()
    );
    this.paginationSortOrder$ = this.pagination$.pipe(
      delay(0),
      map(p => PaginationUtils.getSingleSortOrder(p)),
      publishReplay(1), refCount()
    );
  }


  private searchResults$(filter: F | null, pagination: Pagination | null): Observable<SearchResult<T>> {
    this.loading$.next(true);
    return this.search$(filter, pagination).pipe(
      delay(0),
      tap(() => this.loading$.next(false))
    );
  }
}
