import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ShellTableHelper} from '../../app-shell/shell-table/shell-table-helper';
import {Pagination} from '../../util/pagination';
import {SearchResultFactory} from '../../app-shell/shell-table/search-result.factory';
import {concat, Observable, of} from 'rxjs';
import {filter, map, mergeMap, take, toArray} from 'rxjs/operators';
import {TableColumn} from '../../util/table-column';
import {
  ACTIVE_COLUMN,
  EmployeeColumn,
  FIRST_NAME_COLUMN,
  ID_COLUMN,
  LAST_NAME_COLUMN,
  LOCALE_COLUMN,
  LOGIN_COLUMN
} from '../employee-column/employee-columns';
import {SearchResult} from '../../app-shell/shell-table/search-result';
import {WsEmployee, WsEmployeeSearch, WsEmployeeSearchResult} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../auth.service';
import {Router} from '@angular/router';
import {EmployeeService} from '../../domain/thirdparty/employee.service';

@Component({
  selector: 'cp-employees-list-route',
  templateUrl: './employee-list-route.component.html',
  styleUrls: ['./employee-list-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListRouteComponent implements OnInit {

  employeesTableHelper: ShellTableHelper<WsEmployee, WsEmployeeSearch>;
  selectedEmployees: WsEmployee[] = [];
  columns: TableColumn<EmployeeColumn>[] = [
    ID_COLUMN,
    LAST_NAME_COLUMN,
    FIRST_NAME_COLUMN,
    LOGIN_COLUMN,
    LOCALE_COLUMN,
    ACTIVE_COLUMN,
  ];

  constructor(private employeeService: EmployeeService,
              private authService: AuthService,
              private router: Router,
  ) {
  }

  ngOnInit() {
    this.employeesTableHelper = new ShellTableHelper<WsEmployee, WsEmployeeSearch>(
      (searchFilter, pagination) => this.searchEmployees$(searchFilter, pagination)
    );
    this.authService.getLoggedEmployee$().pipe(
      filter(e => e != null),
      take(1),
    ).subscribe(employee => this.initFilter(employee));
  }

  private searchEmployees$(searchFilter: WsEmployeeSearch | null, pagination: Pagination | null): Observable<SearchResult<WsEmployee>> {
    if (searchFilter == null || pagination == null) {
      return of(SearchResultFactory.emptyResults());
    }
    return this.employeeService.searchEmployeeList$(searchFilter, pagination).pipe(
      mergeMap(results => this.searchResultEmployees$(results)),
    );
  }

  private searchResultEmployees$(results: WsEmployeeSearchResult): Observable<SearchResult<WsEmployee>> {
    const employees$List = results.list.map(ref => this.employeeService.getEmployee$(ref));
    return concat(...employees$List).pipe(toArray()).pipe(
      map(newList => {
        return {
          list: newList,
          totalCount: results.totalCount
        } as SearchResult<WsEmployee>;
      })
    );
  }

  private initFilter(employee: WsEmployee) {
    const searchFilter: WsEmployeeSearch = {
      companyRef: employee.companyRef
    };
    this.employeesTableHelper.setFilter(searchFilter);
  }

  onRowSelect(employee: WsEmployee) {
    this.router.navigate(['/employee', employee.id]);
  }
}
