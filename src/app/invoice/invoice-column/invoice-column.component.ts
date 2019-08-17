import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsInvoice} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import {InvoiceColumn} from './invoice-columns';

@Component({
  selector: 'cp-invoice-column',
  templateUrl: './invoice-column.component.html',
  styleUrls: ['./invoice-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvoiceColumnComponent implements OnInit {

  @Input()
  row: WsInvoice;
  @Input()
  column: TableColumn<InvoiceColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
