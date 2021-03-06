import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {concat, Observable, of} from 'rxjs';
import {filter, map, mergeMap, take, toArray} from 'rxjs/operators';
import {TableColumn} from '../../util/table-column';
import {DEFAULT_CUSTOMER_COLUMN, DESCRIPTION_COLUMN, ID_COLUMN, NAME_COLUMN, PosColumn} from '../pos-column/pos-columns';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {WsEmployee, WsPos, WsPosRef, WsPosSearch, WsPosSearchResult} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';
import {PosService} from '../../domain/commercial/pos.service';

@Component({
  selector: 'cp-pos-list-route',
  templateUrl: './pos-list-route.component.html',
  styleUrls: ['./pos-list-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PosListRouteComponent implements OnInit {

  posTableHelper: ShellTableHelper<WsPos, WsPosSearch>;
  selectedpos: WsPos[] = [];
  columns: TableColumn<PosColumn>[] = [
    ID_COLUMN,
    NAME_COLUMN,
    DESCRIPTION_COLUMN,
    DEFAULT_CUSTOMER_COLUMN,
  ];

  constructor(private posService: PosService,
              private authService: AuthService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.posTableHelper = new ShellTableHelper<WsPos, WsPosSearch>(
      (searchFilter, pagination) => this.searchpos$(searchFilter, pagination)
    );
    this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
    ).subscribe(employee => this.initFilter(employee));
  }

  private searchpos$(searchFilter: WsPosSearch | null, pagination: Pagination | null): Observable<SearchResult<WsPos>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.posService.searchPosList$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultpos$(results)),
    );
  }

  private searchResultpos$(results: WsPosSearchResult): Observable<SearchResult<WsPos>> {
    const pos$List = results.list.map(ref => this.posService.getPos$(ref));
    return concat(...pos$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsPos>;
      })
    );
  }

  private initFilter(employee: WsEmployee) {
    const searchFilter: WsPosSearch = {
      companyRef: employee.companyRef
    };
    this.posTableHelper.setFilter(searchFilter);
  }

  onRowSelect(pos: WsPos) {
    this.router.navigate(['/pos', pos.id]);
  }
}
