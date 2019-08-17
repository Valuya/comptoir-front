import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of, Subscription} from 'rxjs';
import {WsCompanyRef, WsItemRef, WsItemVariantRef, WsItemVariantSearch} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {filter, map, tap} from 'rxjs/operators';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {PaginationUtils} from '../../util/pagination-utils';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {LazyLoadEvent, SelectItem} from 'primeng/api';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {
  ATTRIBUTES_COLUMN,
  ITEM_COLUMN,
  MAIN_PICTURE_COLUMN,
  PRICING_AMOUNT_COLUMN,
  PRICING_COLUMN,
  VARIANT_REFERENCE_COLUMN
} from '../../item/item-variant-column/item-variant-columns';
import {ComptoirSaleService} from '../comptoir-sale.service';

@Component({
  selector: 'cp-variant-select-list',
  templateUrl: './variant-select-list.component.html',
  styleUrls: ['./variant-select-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VariantSelectListComponent implements OnInit, OnDestroy {

  @Input()
  viewLayout: 'list' | 'grid' = 'list';
  @Input()
  autoSelectSingleVariant = true;
  @Input()
  noDebounce: boolean;

  @Input()
  set itemRef(value: WsItemRef) {
    this.itemRef$.next(value);
  }

  @Output()
  variantSelect = new EventEmitter<WsItemVariantRef>();

  tableHelper: ShellTableHelper<WsItemVariantRef, WsItemVariantSearch>;

  searchQuery$ = new BehaviorSubject<string | null>(null);
  itemRef$ = new BehaviorSubject<WsItemRef | null>(null);
  sortOptions: SelectItem[];

  private subscription: Subscription;

  constructor(
    private authService: AuthService,
    private comptoirService: ComptoirSaleService,
  ) {
  }

  ngOnInit() {
    this.subscription = new Subscription();
    this.tableHelper = new ShellTableHelper<WsItemVariantRef, WsItemVariantSearch>(
      (searchFilter, pagination) => this.searchVariants$(searchFilter, pagination),
      {
        noDebounce: this.noDebounce
      }
    );
    this.sortOptions = this.createSortOptions();
    this.tableHelper.setPagination(PaginationUtils.createWithSort(
      ITEM_COLUMN.value
    ));

    const searchFilterSubscription = combineLatest(
      this.itemRef$,
      this.authService.getLoggedEmployeeCompanyRef$(),
      this.searchQuery$,
    ).pipe(
      map(r => this.createSearchFilter(r[0], r[1], r[2])),
    ).subscribe(searchFilter => this.tableHelper.setFilter(searchFilter));
    this.subscription.add(searchFilterSubscription);

    const singleSubscription = this.tableHelper.results$.pipe(
      filter(results => results.totalCount === 1 && results.list.length === 1),
      map(results => results.list[0]),
      filter(() => this.autoSelectSingleVariant)
    ).subscribe(singleResult => this.onVariantClick(singleResult));
    this.subscription.add(singleSubscription);
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

  onVariantClick(ref: WsItemVariantRef) {
    this.variantSelect.emit(ref);
  }

  private createSearchFilter(itemRef: WsItemRef | null, companyRef: WsCompanyRef | null, searchQuery: string | null): WsItemVariantSearch {
    if (itemRef == null || companyRef == null) {
      return null;
    }
    return {
      itemRef: itemRef as object,
      itemSearch: {
        companyRef: companyRef as object,
      },
      variantReferenceContains: searchQuery
    };
  }

  private searchVariants$(searchFilter: WsItemVariantSearch, pagination: Pagination): Observable<SearchResult<WsItemVariantRef>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    // TODO: proper way to plug cache
    const itemRef = searchFilter.itemRef;
    return this.comptoirService.listItemVariants$(itemRef);
  }

  private createSortOptions() {
    return [
      MAIN_PICTURE_COLUMN,
      ITEM_COLUMN,
      VARIANT_REFERENCE_COLUMN,
      ATTRIBUTES_COLUMN,
      PRICING_COLUMN,
      PRICING_AMOUNT_COLUMN,
    ].map(col => {
      return {
        value: col.value,
        label: col.header,
      } as SelectItem;
    });
  }

}
