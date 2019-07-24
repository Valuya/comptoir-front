import {concat, Observable, Subject} from 'rxjs';
import {publishReplay, refCount, retry, switchMap, take, takeUntil} from 'rxjs/operators';
import {SearchResult} from '../../../app-shell/shell-table/search-result';

export class SimpleSearchResultResourceCache<T> {

  private fetcher: () => Observable<SearchResult<T>>;
  private cache$: Observable<SearchResult<T> | null>;
  private refetchSource$ = new Subject<any>();
  private invalidateSource$ = new Subject<any>();

  constructor(fetcher: () => Observable<SearchResult<T>>) {
    this.fetcher = fetcher;
    this.cache$ = concat(
      fetcher(),
      this.refetchSource$.pipe(
        takeUntil(this.invalidateSource$),
        switchMap(() => fetcher())
      )
    ).pipe(
      publishReplay(1), refCount(),
      retry(),
    );
  }

  getOneResults$(): Observable<SearchResult<T>> {
    return this.cache$.pipe(take(1));
  }

  invalidate() {
    this.invalidateSource$.next(true);
  }

  refetch() {
    this.refetchSource$.next(true);
  }

}
