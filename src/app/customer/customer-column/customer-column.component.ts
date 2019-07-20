import {Component, Input, OnInit} from '@angular/core';
import {WsCustomer} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import {CustomerColumn} from './customer-columns';

@Component({
  selector: 'cp-customer-column',
  templateUrl: './customer-column.component.html',
  styleUrls: ['./customer-column.component.scss']
})
export class CustomerColumnComponent implements OnInit {

  @Input()
  row: WsCustomer;
  @Input()
  column: TableColumn<CustomerColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
