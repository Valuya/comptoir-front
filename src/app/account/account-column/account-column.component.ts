import {Component, Input, OnInit} from '@angular/core';
import {WsAccount} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import {AccountColumn} from './account-columns';

@Component({
  selector: 'cp-account-column',
  templateUrl: './account-column.component.html',
  styleUrls: ['./account-column.component.scss']
})
export class AccountColumnComponent implements OnInit {

  @Input()
  row: WsAccount;
  @Input()
  column: TableColumn<AccountColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
