import {ResourceCache} from './resouce-cache';
import {Observable} from 'rxjs';
import {SimpleResourceCache} from './simple-resource-cache';
import {tap} from 'rxjs/operators';

export class CachedResourceClient<R, T> {
  private cache: ResourceCache<T>;

  private get$: (ref: R) => Observable<T>;
  private put$?: (val: T) => Observable<R>;
  private post$?: (val: T) => Observable<R>;
  private delete$?: (ref: R) => Observable<R>;

  constructor(
    get$: (ref: R) => Observable<T>,
    put$?: (val: T) => Observable<R>,
    post$?: (val: T) => Observable<R>,
    delete$?: (ref: R) => Observable<R>,
  ) {
    this.get$ = get$;
    this.put$ = put$;
    this.post$ = post$;
    this.delete$ = delete$;
    this.cache = new SimpleResourceCache(this.get$);
  }

  getResource$(ref: R): Observable<T> {
    return this.cache.get$(ref);
  }

  updateResource$(value: T): Observable<R> {
    return this.put$(value).pipe(
      tap(ref => this.cache.clear(ref))
    );
  }

  createResource$(value: T): Observable<R> {
    return this.post$(value).pipe(
      tap(ref => this.cache.clear(ref))
    );
  }

  deleteResource$(ref: R): Observable<R> {
    return this.delete$(ref).pipe(
      tap(() => this.cache.clear(ref))
    );
  }

  clearCache(ref: R) {
    this.cache.clear(ref);
  }

  setCachedValue(value: T) {
    this.cache.put(value);
  }
}
