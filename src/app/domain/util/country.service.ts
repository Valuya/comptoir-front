import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {Observable} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {WsCountry, WsCountrySearchResult} from '@valuya/comptoir-ws-api';
import {map, switchMap} from 'rxjs/operators';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {ResourceRef} from './cache/resource-ref';

@Injectable({
  providedIn: 'root'
})
export class CountryService {


  private countryCache: CachedResourceClient<ResourceRef<string>, WsCountry>;

  constructor(
    private apiService: ApiService
  ) {
    this.countryCache = new CachedResourceClient<ResourceRef<string>, WsCountry>(
      ref => this.doGet$(ref),
      // val => this.doPut$(val),
      // val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
    );
  }

  saveCountry(country: WsCountry): Observable<WsCountry> {
    if (country.code == null) {
      return this.countryCache.createResource$(country).pipe(
        switchMap(ref => this.countryCache.getResource$(ref))
      );
    } else {
      return this.countryCache.updateResource$(country).pipe(
        switchMap(ref => this.countryCache.getResource$(ref))
      );
    }
  }

  getCountry$(ref: string): Observable<WsCountry> {
    return this.countryCache.getResource$({id: ref});
  }

  searchCountryList$(seachFilter: any, pagination: Pagination): Observable<SearchResult<string>> {
    return this.apiService.api.searchCountries({
      offset: pagination.first,
      length: pagination.rows,
    }).pipe(
      map((results: SearchResult<{ code: string }>) => {
        const codeList = results.list.map(ref => ref.code);
        return Object.assign({}, results, {
          list: codeList
        });
      })) as any as Observable<SearchResult<string>>;
  }

  private doGet$(ref: ResourceRef<string>) {
    const country$ = this.apiService.api.getCountry({
      code: ref.id
    }) as any as Observable<WsCountry>;
    // For the cache
    return country$.pipe(
      map(c => Object.assign({}, c, {
        id: c.code
      } as WsCountry & ResourceRef<string>))
    );
  }

  //
  // private doPut$(val: WsCountry) {
  //   return this.apiService.api.updateCountry({
  //     id: val.id,
  //     wsCountry: val
  //   }) as any as Observable<string>;
  // }
  //
  // private doCreate$(val: WsCountry) {
  //   return this.apiService.api.createCountry({
  //     wsCountry: val
  //   }) as any as Observable<string>;
  // }

  // private doDelete$(ref: string) {
  //   return this.apiService.api.remo({
  //     id: ref.id
  //   }) as any as Observable<string>;
  // }
//
}
