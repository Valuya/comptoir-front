import {BehaviorSubject, concat, Observable, Subject} from 'rxjs';
import {publishReplay, refCount, retry, shareReplay, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {SearchResult} from '../../../app-shell/shell-table/search-result';

export class SimpleSearchResultResourceCache<T> {

  private fetcher: () => Observable<SearchResult<T>>;
  private cache$: Observable<SearchResult<T> | null>;
  private refetchSource$ = new BehaviorSubject<any>(true);
  // private invalidateSource$ = new Subject<any>();

  constructor(fetcher: () => Observable<SearchResult<T>>) {
    this.fetcher = fetcher;
    this.cache$ = this.refetchSource$.pipe(
      // takeUntil(this.invalidateSource$),
      switchMap(() => fetcher()),
      publishReplay(1), refCount()
    );
  }

  getResults$(): Observable<SearchResult<T>> {
    return this.cache$;
  }

  getOneResults$(): Observable<SearchResult<T>> {
    return this.cache$.pipe(take(1));
  }

  invalidate() {
    this.refetchSource$.next(true);
  }

  refetch() {
    this.refetchSource$.next(true);
  }

}
