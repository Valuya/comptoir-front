import {Pagination} from '../../util/pagination';
import {BehaviorSubject, combineLatest, forkJoin, Observable, of} from 'rxjs';
import {concatMap, debounceTime, delay, map, mergeMap, publishReplay, refCount, share, skip, switchMap, take, tap} from 'rxjs/operators';
import {SearchResult} from './search-result';
import {PaginationUtils} from '../../util/pagination-utils';
import {ShellTableHelperOptions} from './shell-table-helper-options';

export class ShellTableHelper<T, F> {

  private search$: (filter: any, pagination: Pagination) => Observable<SearchResult<T>>;

  filter$ = new BehaviorSubject<F | null>(null);
  pagination$ = new BehaviorSubject<Pagination | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);

  uncachedResults: Observable<SearchResult<T>>;
  results$: Observable<SearchResult<T>>;
  rows$: Observable<T[]>;
  totalCount$: Observable<number>;
  paginationFirst$: Observable<number>;
  paginationRows$: Observable<number>;
  paginationSortField$: Observable<string>;
  paginationSortOrder$: Observable<1 | -1>;

  private options: ShellTableHelperOptions;

  constructor(
    search$: (filter: F | null, pagination: Pagination | null) => Observable<SearchResult<T>>,
    options?: ShellTableHelperOptions
  ) {
    this.search$ = search$;
    this.options = options;
    this.initResults();
  }

  setFilter(filter: F) {
    this.filter$.next(filter);
  }

  setPagination(pagination: Pagination) {
    this.pagination$.next(pagination);
  }

  reload(): Observable<T[]> {
    const filterAndPagination$ = forkJoin(
      this.filter$.pipe(take(1)),
      this.pagination$.pipe(take(1)),
    );
    const reloadedRows$ = filterAndPagination$.pipe(
      tap(r => {
        this.filter$.next(r[0]);
        this.pagination$.next(r[1]);
      }),
      mergeMap(() => this.uncachedResults),
      map(results => results.list),
      take(1), // next fresh value
      publishReplay(1), refCount()
    );
    reloadedRows$.subscribe();
    return reloadedRows$;
  }

  private initResults() {
    const filterAndpagination$ = this.getFilterAndPagination$();
    this.uncachedResults = filterAndpagination$.pipe(
      switchMap(results => this.searchResults$(results[0], results[1])),
      share()
    );
    this.results$ = this.uncachedResults.pipe(
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


  private getFilterAndPagination$(): Observable<[F | null, Pagination | null]> {
    if (this.options == null) {
      return combineLatest(this.filter$, this.pagination$);
    } else {
      const filter$ = this.options.ignoreFilter ? of(null) : this.filter$;
      const pagination$ = this.options.ignorePagination ? of(null) : this.pagination$;
      const filterandPagination$ = combineLatest(filter$, pagination$);
      if (this.options.noDebounce) {
        return filterandPagination$;
      } else {
        return filterandPagination$.pipe(
          debounceTime(50)
        );
      }
    }
  }

  private searchResults$(filter: F | null, pagination: Pagination | null): Observable<SearchResult<T>> {
    this.loading$.next(true);
    return this.search$(filter, pagination).pipe(
      delay(0),
      tap(() => this.loading$.next(false))
    );
  }
}
