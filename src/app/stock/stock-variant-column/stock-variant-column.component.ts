import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TableColumn} from '../../util/table-column';
import {WsItemVariantStock} from '@valuya/comptoir-ws-api';
import {StockVariantColumn} from './stock-variant-columns';

@Component({
  selector: 'cp-stock-variant-column',
  templateUrl: './stock-variant-column.component.html',
  styleUrls: ['./stock-variant-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockVariantColumnComponent implements OnInit {

  @Input()
  row: WsItemVariantStock;
  @Input()
  column: TableColumn<StockVariantColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
