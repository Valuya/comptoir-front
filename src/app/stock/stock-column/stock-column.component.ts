import {Component, Input, OnInit} from '@angular/core';
import {WsStock} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import {StockColumn} from './stock-columns';

@Component({
  selector: 'cp-stock-column',
  templateUrl: './stock-column.component.html',
  styleUrls: ['./stock-column.component.scss']
})
export class StockColumnComponent implements OnInit {

  @Input()
  row: WsStock;
  @Input()
  column: TableColumn<StockColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
