import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {WsCompanyRef, WsItemRef, WsItemSearch} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {ApiService} from '../../api.service';
import {debounceTime, map, publishReplay, refCount} from 'rxjs/operators';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {PaginationUtils} from '../../util/pagination-utils';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {MULTIPLE_SALE_COLUMN, NAME_COLUMN, REFERENCE_COLUMN, VAT_EXCLUSIVE_COLUMN} from '../../item/item-column/item-columns';
import {LazyLoadEvent, SelectItem} from 'primeng/api';
import {VAT_RATE_COLUMN} from '../../sale/sale-variant-column/sale-variant-columns';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';

@Component({
  selector: 'cp-item-select-list',
  templateUrl: './item-select-list.component.html',
  styleUrls: ['./item-select-list.component.scss']
})
export class ItemSelectListComponent implements OnInit, OnDestroy {

  @Input()
  viewLayout: 'list' | 'grid' = 'list';

  @Output()
  itemSelect = new EventEmitter<WsItemRef>();

  tableHelper: ShellTableHelper<WsItemRef, WsItemSearch>;

  searchQuery$ = new BehaviorSubject<string | null>(null);

  private subscription: Subscription;
  private sortOptions: SelectItem[];

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
  ) {
  }

  ngOnInit() {
    this.subscription = new Subscription();
    this.tableHelper = new ShellTableHelper<WsItemRef, WsItemSearch>(
      (filter, pagination) => this.searchItems$(filter, pagination)
    );
    this.sortOptions = this.createSortOptions();
    this.tableHelper.setPagination(PaginationUtils.createWithSort(
      NAME_COLUMN.value
    ));

    const companyRef$ = this.authService.getLoggedEmployeeCompanyRef$();
    const searchFilterSubscription = combineLatest(
      companyRef$,
      this.searchQuery$.pipe(debounceTime(300)),
    ).pipe(
      map(r => this.createSearchFilter(r[0], r[1])),
    ).subscribe(searchFilter => this.tableHelper.setFilter(searchFilter));
    this.subscription.add(searchFilterSubscription);

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLazyLoad(event: LazyLoadEvent) {
    const pagination = PaginationUtils.createFromEvent(event);
    this.tableHelper.setPagination(pagination);
  }

  onSortFieldChange($event: any) {
  }

  onItemClick(ref: WsItemRef) {
    this.itemSelect.emit(ref)
  }

  private createSearchFilter(companyRef: WsCompanyRef | null, searchQuery: string | null): WsItemSearch {
    if (companyRef == null) {
      return null;
    }
    return {
      companyRef: companyRef as object,
      multiSearch: searchQuery,
    };
  }

  private searchItems$(filter: WsItemSearch, pagination: Pagination): Observable<SearchResult<WsItemRef>> {
    if (filter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    const searchResults$ = this.apiService.api.findItems({
      offset: pagination.first,
      length: pagination.rows,
      sort: PaginationUtils.sortMetaToQueryParam(pagination.multiSortMeta),
      wsItemSearch: filter
    }) as any as Observable<SearchResult<WsItemRef>>;
    return searchResults$;
  }

  private createSortOptions() {
    return [
      NAME_COLUMN,
      REFERENCE_COLUMN,
      VAT_EXCLUSIVE_COLUMN,
      VAT_RATE_COLUMN,
      MULTIPLE_SALE_COLUMN,
    ].map(col => {
      return {
        value: col.value,
        label: col.header,
      } as SelectItem;
    });
  }

}
