import {Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {Pagination} from '../../util/pagination';
import {TableColumn} from '../../util/table-column';
import {LazyLoadEvent} from 'primeng/api';
import {ShellColumnDirective} from './shell-column.directive';
import {FilterContentDirective} from './filter-content.directive';
import {PaginationUtils} from '../../util/pagination-utils';

@Component({
  selector: 'cp-shell-table',
  templateUrl: './shell-table.component.html',
  styleUrls: ['./shell-table.component.scss']
})
export class ShellTableComponent implements OnInit {

  @Input()
  totalRecords: number;
  @Input()
  pagination: Pagination;
  @Input()
  columns: TableColumn<any>[];
  @Input()
  rows: any[];
  @Input()
  selection: any[] = [];
  @Input()
  loading: boolean;

  @Output()
  paginationChange = new EventEmitter<Pagination>();
  @Output()
  selectionChange = new EventEmitter<any[]>();
  @Output()
  rowSelect = new EventEmitter<any>();

  @ContentChild(ShellColumnDirective, {static: false, read: TemplateRef})
  columnTemplate: TemplateRef<any>;
  @ContentChild(FilterContentDirective, {static: false, read: TemplateRef})
  filterContentTemplate: TemplateRef<any>;

  constructor() {
  }

  ngOnInit() {
  }

  onRowSelect(event: any) {
    this.rowSelect.next(event.data);
  }

  onLazyLoad(event: LazyLoadEvent) {
    const pagination = PaginationUtils.createFromEvent(event);
    this.paginationChange.next(pagination);
  }

  onSelectionChange(rows: any[]) {
    this.selection = rows;
    this.selectionChange.next(rows);
  }

  stopEvent(event: Event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return false;
  }
}
