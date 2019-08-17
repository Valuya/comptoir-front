import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsAccountingEntry, WsSale} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import {SaleColumn} from '../../sale/sale-column/sale-columns';
import {AccountingEntryColumn} from './accounting-entry-columns';

@Component({
  selector: 'cp-accounting-entry-column',
  templateUrl: './accounting-entry-column.component.html',
  styleUrls: ['./accounting-entry-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountingEntryColumnComponent implements OnInit {

  @Input()
  row: WsAccountingEntry;
  @Input()
  column: TableColumn<AccountingEntryColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
