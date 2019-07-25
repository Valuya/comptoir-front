import {Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {WsCompanyRef, WsItem, WsItemVariant, WsItemVariantSearch, WsItemVariantSearchResult} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import {
  ATTRIBUTES_COLUMN,
  ID_COLUMN,
  ItemVariantColumn,
  MAIN_PICTURE_COLUMN,
  PRICING_AMOUNT_COLUMN,
  PRICING_COLUMN,
  VARIANT_REFERENCE_COLUMN
} from '../item-variant-column/item-variant-columns';
import {AuthService} from '../../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, mergeMap, publishReplay, refCount, take, toArray} from 'rxjs/operators';
import {Pagination} from '../../util/pagination';
import {combineLatest, concat, forkJoin, Observable, of} from 'rxjs';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {ItemService} from '../../domain/commercial/item.service';

@Component({
  selector: 'cp-item-detail-variants-route',
  templateUrl: './item-detail-variants-route.component.html',
  styleUrls: ['./item-detail-variants-route.component.scss']
})
export class ItemDetailVariantsRouteComponent implements OnInit {

  itemVariantTableHelper: ShellTableHelper<WsItemVariant, WsItemVariantSearch>;
  selectedItemVariants: WsItemVariant[] = [];
  columns: TableColumn<ItemVariantColumn>[] = [
    ID_COLUMN,
    MAIN_PICTURE_COLUMN,
    VARIANT_REFERENCE_COLUMN,
    ATTRIBUTES_COLUMN,
    PRICING_COLUMN,
    PRICING_AMOUNT_COLUMN,
  ];
  item$: Observable<WsItem | null>;

  constructor(private itemService: ItemService,
              private authService: AuthService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.itemVariantTableHelper = new ShellTableHelper<WsItemVariant, WsItemVariantSearch>(
      (searchFilter, pagination) => this.searchitemVariant$(searchFilter, pagination)
    );
    const companyRef$ = this.authService.getLoggedEmployeeCompanyRef$().pipe(
      filter(c => c != null),
      take(1)
    );
    const item$List = this.activatedRoute.pathFromRoot.map(
      route => route.data.pipe(map(data => data.item))
    );
    this.item$ = combineLatest(...item$List).pipe(
      map(list => list.find(item => item != null)),
      publishReplay(1), refCount(),
    );
    forkJoin(companyRef$, this.item$.pipe(filter(i => i != null), take(1)))
      .subscribe(r => this.initFilter(r[0], r[1]));
  }

  private searchitemVariant$(searchFilter: WsItemVariantSearch | null, pagination: Pagination | null): Observable<SearchResult<WsItemVariant>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.itemService.searchVariants$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultitemVariant$(results)),
    );
  }

  private searchResultitemVariant$(results: WsItemVariantSearchResult): Observable<SearchResult<WsItemVariant>> {
    const itemVariant$List = results.list.map(ref => this.itemService.getItemVariant$(ref));
    return concat(...itemVariant$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsItemVariant>;
      })
    );
  }

  private initFilter(companyRefValue: WsCompanyRef, item: WsItem) {
    if (companyRefValue == null || item == null) {
      return;
    }
    const searchFilter: WsItemVariantSearch = {
      itemRef: {id: item.id},
      itemSearch: {
        companyRef: companyRefValue,
      }
    };
    this.itemVariantTableHelper.setFilter(searchFilter);
  }

  onRowSelect(itemVariant: WsItemVariant) {
    this.item$.pipe(
      take(1)
    ).subscribe(item => {
      this.router.navigate(['/item', item.id, 'variant', itemVariant.id]);
    });
  }

  onNewVariantClick() {
    this.router.navigate(['../new'], {
      relativeTo: this.activatedRoute
    });
  }
}
