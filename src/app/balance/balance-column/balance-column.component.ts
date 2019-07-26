import {Component, Input, OnInit} from '@angular/core';
import {WsBalance} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import {BalanceColumn} from './balance-columns';

@Component({
  selector: 'cp-balance-column',
  templateUrl: './balance-column.component.html',
  styleUrls: ['./balance-column.component.scss']
})
export class BalanceColumnComponent implements OnInit {

  @Input()
  row: WsBalance;
  @Input()
  column: TableColumn<BalanceColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
