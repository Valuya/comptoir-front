import {Injectable} from '@angular/core';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {WsAccountingEntry, WsAccountingEntryRef, WsAccountingEntrySearch} from '@valuya/comptoir-ws-api';
import {ApiService} from '../../api.service';
import {Observable} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {PaginationUtils} from '../../util/pagination-utils';
import {SearchResult} from '../../app-shell/shell-table/search-result';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  entriesCache: CachedResourceClient<WsAccountingEntryRef, WsAccountingEntry>;

  constructor(
    private apiService: ApiService,
  ) {
    this.entriesCache = new CachedResourceClient<WsAccountingEntryRef, WsAccountingEntry>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      ref => this.doDelete$(ref),
    );
  }

  getEntry$(ref: WsAccountingEntryRef): Observable<WsAccountingEntry> {
    return this.entriesCache.getResource$(ref);
  }

  saveEntry$(entry: WsAccountingEntry): Observable<WsAccountingEntryRef> {
    if (entry.id == null) {
      return this.entriesCache.createResource$(entry);
    } else {
      return this.entriesCache.updateResource$(entry);
    }
  }

  removeEntry$(ref: WsAccountingEntryRef): Observable<any> {
    return this.entriesCache.deleteResource$(ref);
  }

  searchEntries$(searchFilter: WsAccountingEntrySearch, pagination: Pagination): Observable<SearchResult<WsAccountingEntryRef>> {
    const searchResult$ = this.apiService.api.searchAccountingEntries({
      offset: pagination.first,
      length: pagination.rows,
      sort: PaginationUtils.sortMetaToQueryParam(pagination.multiSortMeta),
      wsAccountingEntrySearch: searchFilter
    }) as any as Observable<SearchResult<WsAccountingEntryRef>>;
    return searchResult$;
  }

  clearCachedEntry(ref: WsAccountingEntryRef) {
    this.entriesCache.clearCache(ref);
  }

  private doGet$(ref: WsAccountingEntryRef) {
    return this.apiService.api.getAccountingEntry({
      id: ref.id
    }) as any as Observable<WsAccountingEntry>;
  }


  private doPut$(val: WsAccountingEntry) {
    return this.apiService.api.updateAccountingEntry({
      id: val.id,
      wsAccountingEntry: val
    }) as any as Observable<WsAccountingEntryRef>;
  }

  private doCreate$(val: WsAccountingEntry) {
    return this.apiService.api.createAccountingEntry({
      wsAccountingEntry: val
    }) as any as Observable<WsAccountingEntryRef>;
  }

  private doDelete$(ref: WsAccountingEntryRef) {
    return this.apiService.api.deleteAccountingEntry({
      id: ref.id
    }) as any as Observable<WsAccountingEntryRef>;
  }

  cacheEntries(results: SearchResult<WsAccountingEntry>) {
    results.list.forEach(entry => this.entriesCache.setCachedValue(entry));
  }
}
