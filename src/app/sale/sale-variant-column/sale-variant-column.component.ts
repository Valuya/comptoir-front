import {Component, Input, OnInit} from '@angular/core';
import {TableColumn} from '../../util/table-column';
import {WsItemVariantSale} from '@valuya/comptoir-ws-api';
import {SaleVariantColumn} from './sale-variant-columns';

@Component({
  selector: 'cp-sale-variant-column',
  templateUrl: './sale-variant-column.component.html',
  styleUrls: ['./sale-variant-column.component.scss']
})
export class SaleVariantColumnComponent implements OnInit {

  @Input()
  row: WsItemVariantSale;
  @Input()
  column: TableColumn<SaleVariantColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
