import {Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {TableColumn} from '../../util/table-column';
import {ApiService} from '../../api.service';
import {AuthService} from '../../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, mergeMap, take, toArray} from 'rxjs/operators';
import {Pagination} from '../../util/pagination';
import {concat, Observable, of} from 'rxjs';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {ID_COLUMN, ItemVariantColumn} from '../item-variant-column/item-variant-columns';
import {WsItemVariant, WsEmployee, WsItemVariantSearch, WsItemVariantSearchResult} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-item-variant-list-route',
  templateUrl: './item-variant-list-route.component.html',
  styleUrls: ['./item-variant-list-route.component.scss']
})
export class ItemVariantListRouteComponent implements OnInit {

  itemVariantTableHelper: ShellTableHelper<WsItemVariant, WsItemVariantSearch>;
  selecteditemVariant: WsItemVariant[] = [];
  columns: TableColumn<ItemVariantColumn>[] = [
    ID_COLUMN
  ];

  constructor(private apiService: ApiService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.itemVariantTableHelper = new ShellTableHelper<WsItemVariant, WsItemVariantSearch>(
      (searchFilter, pagination) => this.searchitemVariant$(searchFilter, pagination)
    );
    this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
    ).subscribe(employee => this.initFilter(employee));
  }

  private searchitemVariant$(searchFilter: WsItemVariantSearch | null, pagination: Pagination | null): Observable<SearchResult<WsItemVariant>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    const results$ = this.apiService.api.findItemVariants({
      wsItemVariantSearch: searchFilter,
      offset: pagination.first,
      length: pagination.rows,
    }) as any as Observable<WsItemVariantSearchResult>;
    return results$.pipe(
      mergeMap(results => this.searchResultitemVariant$(results)),
    );
  }

  private searchResultitemVariant$(results: WsItemVariantSearchResult): Observable<SearchResult<WsItemVariant>> {
    const itemVariant$List = results.list.map(ref => this.apiService.api.getItemVariant({
      id: ref.id
    }));
    return concat(...itemVariant$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsItemVariant>;
      })
    );
  }

  private initFilter(employee: WsEmployee) {
    const searchFilter: WsItemVariantSearch = {
      // companyRef: employee.companyRef
    };
    this.itemVariantTableHelper.setFilter(searchFilter);
  }

  onRowSelect(itemVariant: WsItemVariant) {
    this.router.navigate(['/itemVariant', itemVariant.id]);
  }

  onNewVariantClick() {
    this.router.navigate(['../new'], {
      relativeTo: this.activatedRoute
    });
  }
}
