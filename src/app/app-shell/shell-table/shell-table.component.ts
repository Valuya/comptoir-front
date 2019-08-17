import {ChangeDetectionStrategy, Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {Pagination} from '../../util/pagination';
import {TableColumn} from '../../util/table-column';
import {LazyLoadEvent} from 'primeng/api';
import {ShellColumnDirective} from './shell-column.directive';
import {FilterContentDirective} from './filter-content.directive';
import {PaginationUtils} from '../../util/pagination-utils';
import {Table} from 'primeng/table';

@Component({
  selector: 'cp-shell-table',
  templateUrl: './shell-table.component.html',
  styleUrls: ['./shell-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  rowClick = new EventEmitter<any>();

  @ContentChild(ShellColumnDirective, {static: false, read: TemplateRef})
  columnTemplate: TemplateRef<any>;
  @ContentChild(FilterContentDirective, {static: false, read: TemplateRef})
  filterContentTemplate: TemplateRef<any>;
  @ViewChild(Table, {static: false})
  private tableChild: Table;

  constructor() {
  }

  ngOnInit() {
  }

  onRowSelect(event: any) {
    this.rowClick.next(event.data);
  }

  onRowClick(row: any) {
    this.rowClick.next(row);
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
    console.log('stopped ' + event);
    return false;
  }

  scrollToTop() {
    const tableBodyElement = this.getTableBodyElement();
    if (tableBodyElement != null) {
      tableBodyElement.scrollTop = 0;
    }
  }

  scrollToBottom() {
    const tableBodyElement = this.getTableBodyElement();
    if (tableBodyElement != null) {
      tableBodyElement.scrollTop = tableBodyElement.scrollHeight;
    }
  }

  private getTableBodyElement() {
    if (this.tableChild) {
      const tableElement: HTMLElement = this.tableChild.containerViewChild.nativeElement;
      const tableBodyElements = tableElement.getElementsByClassName('ui-table-scrollable-body');
      if (tableBodyElements.length > 0) {
        return tableBodyElements[0];
      }
    }
    return null;
  }
}
