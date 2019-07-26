import {Component, Input, OnInit} from '@angular/core';
import {WsEmployee} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import {EmployeeColumn} from './employee-columns';

@Component({
  selector: 'cp-employee-column',
  templateUrl: './employee-column.component.html',
  styleUrls: ['./employee-column.component.scss']
})
export class EmployeeColumnComponent implements OnInit {

  @Input()
  row: WsEmployee;
  @Input()
  column: TableColumn<EmployeeColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
