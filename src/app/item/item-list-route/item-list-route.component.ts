import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {TableColumn} from '../../util/table-column';
import {
  ItemColumn,
  MAIN_PICTURE_COLUMN,
  MULTIPLE_SALE_COLUMN,
  NAME_COLUMN,
  REFERENCE_COLUMN,
  VAT_EXCLUSIVE_COLUMN,
  VAT_RATE_COLUMN
} from '../../item/item-column/item-columns';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';
import {filter, map, mergeMap, take, toArray} from 'rxjs/operators';
import {Pagination} from '../../util/pagination';
import {concat, Observable, of} from 'rxjs';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {WsEmployee, WsItem, WsItemSearch, WsItemSearchResult} from '@valuya/comptoir-ws-api';
import {ItemService} from '../../domain/commercial/item.service';

@Component({
  selector: 'cp-item-list-route',
  templateUrl: './item-list-route.component.html',
  styleUrls: ['./item-list-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemListRouteComponent implements OnInit {

  itemTableHelper: ShellTableHelper<WsItem, WsItemSearch>;
  selecteditem: WsItem[] = [];
  columns: TableColumn<ItemColumn>[] = [
    MAIN_PICTURE_COLUMN,
    REFERENCE_COLUMN,
    NAME_COLUMN,
    MULTIPLE_SALE_COLUMN,
    VAT_RATE_COLUMN,
    VAT_EXCLUSIVE_COLUMN,
  ];

  constructor(private itemService: ItemService,
              private authService: AuthService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.itemTableHelper = new ShellTableHelper<WsItem, WsItemSearch>(
      (searchFilter, pagination) => this.searchitem$(searchFilter, pagination)
    );
    this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
    ).subscribe(employee => this.initFilter(employee));
  }

  private searchitem$(searchFilter: WsItemSearch | null, pagination: Pagination | null): Observable<SearchResult<WsItem>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.itemService.searchsItems$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultitem$(results)),
    );
  }

  private searchResultitem$(results: WsItemSearchResult): Observable<SearchResult<WsItem>> {
    const item$List = results.list.map(ref => this.itemService.getItem$(ref));
    return concat(...item$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsItem>;
      })
    );
  }

  private initFilter(employee: WsEmployee) {
    const searchFilter: WsItemSearch = {
      companyRef: employee.companyRef
    };
    this.itemTableHelper.setFilter(searchFilter);
  }

  onRowSelect(item: WsItem) {
    this.router.navigate(['/item', item.id]);
  }
}
