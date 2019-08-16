import {ResourceCache} from './resouce-cache';
import {ResourceRef} from './resource-ref';
import {concat, EMPTY, never, Observable, of, race, throwError, timer} from 'rxjs';
import {delay, map, mergeMap, publishReplay, refCount, take, tap} from 'rxjs/operators';

export class SimpleResourceCache<T extends ResourceRef> implements ResourceCache<T> {

  private fetcher: (ref: ResourceRef) => Observable<T>;
  private cache: { [id: number]: Observable<T> } = {};

  constructor(fetcher: (ref: ResourceRef) => Observable<T>) {
    this.fetcher = fetcher;
  }

  get$(ref: ResourceRef, options?: { refetch?: boolean; prependCachedValue?: boolean }): Observable<T> {
    if (ref.id == null) {
      return throwError('Invalid ref: ' + ref);
    }

    const cachedOrNever$ = this.getCachedOrNever$(ref);
    const cachedOrEmpty$ = this.getCachedOrEmpty$(ref);
    const fetched$ = of(null).pipe(
      mergeMap(() => this.fetch(ref)),
      publishReplay(1), refCount()
    );
    this.putValue$IfAbsent(ref, fetched$);


    if (options && options.prependCachedValue) {
      return concat(cachedOrEmpty$, fetched$);
    } else if (options && options.refetch) {
      this.clear(ref);
      return fetched$;
    } else {
      return concat(cachedOrEmpty$, fetched$).pipe(
        take(1)
      );
    }
  }

  put(value: T, ref?: ResourceRef) {
    let idValue;
    if (ref == null) {
      if (value.id == null) {
        throw new Error('Invalid ref: ' + value);
      } else {
        idValue = value.id;
      }
    } else {
      idValue = ref.id;
    }
    this.cache[idValue] = of(value);
  }

  putValue$IfAbsent(ref: ResourceRef, value$: Observable<T>) {
    if (this.cache[ref.id] == null) {
      this.cache[ref.id] = value$;
    }
  }

  clear(ref: ResourceRef) {
    if (ref.id == null) {
      throw new Error('Invalid ref: ' + ref);
    }
    this.cache[ref.id] = null;
  }

  private getCachedOrEmpty$(ref: ResourceRef) {
    const cached = this.cache[ref.id];
    return cached == null ? EMPTY : cached;
  }

  private getCachedOrNever$(ref: ResourceRef) {
    const cached = this.cache[ref.id];
    return cached == null ? never() : cached;
  }

  private fetch(ref: ResourceRef): Observable<T> {
    const value$ = this.fetcher(ref).pipe(
      tap(f => this.put(f)),
    );
    return value$;
  }

}
