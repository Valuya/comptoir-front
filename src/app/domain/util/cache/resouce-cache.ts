import {Observable} from 'rxjs';
import {FetchOptions} from './fetch-options';
import {ResourceRef} from './resource-ref';

export interface ResourceCache<T> {

  get$(ref: ResourceRef, options?: FetchOptions): Observable<T>;

  put(value: T);

  clear(ref: ResourceRef);

}
