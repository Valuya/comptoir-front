import {ResourceCache} from './resouce-cache';
import {ResourceRef} from './resource-ref';
import {concat, EMPTY, Observable, of, throwError, timer} from 'rxjs';
import {delay, mergeMap, take, tap} from 'rxjs/operators';

export class SimpleResourceCache<T extends ResourceRef> implements ResourceCache<T> {

  private fetcher: (ref: ResourceRef) => Observable<T>;
  private cache: { [id: number]: T } = {};

  constructor(fetcher: (ref: ResourceRef) => Observable<T>) {
    this.fetcher = fetcher;
  }

  get$(ref: ResourceRef, options?: { refetch?: boolean; prependCachedValue?: boolean }): Observable<T> {
    if (ref.id == null) {
      return throwError('Invalid ref: ' + ref);
    }
    const cached$ = this.getCachedOrEmpty$(ref);
    const fetched$ = of(null).pipe(
      mergeMap(() => this.fetcher(ref)),
      tap(f => this.put(f)),
    );
    if (options && options.prependCachedValue) {
      return concat(cached$, fetched$);
    } else if (options && options.refetch) {
      return fetched$;
    } else {
      return concat(cached$, fetched$).pipe(
        take(1),
      );
    }
  }

  put(value: T) {
    if (value.id == null) {
      throw new Error('Invalid ref: ' + value);
    }
    this.cache[value.id] = value;
  }

  clear(ref: ResourceRef) {
    if (ref.id == null) {
      throw new Error('Invalid ref: ' + ref);
    }
    this.cache[ref.id] = null;
  }

  private getCachedOrEmpty$(ref: ResourceRef) {
    const cached = this.cache[ref.id];
    return cached == null ? EMPTY : of(cached);
  }
}
