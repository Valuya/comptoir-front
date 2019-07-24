import {Component, Input, OnInit} from '@angular/core';
import {WsItemVariantSale} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-sale-item-grid-item',
  templateUrl: './sale-item-grid-item.component.html',
  styleUrls: ['./sale-item-grid-item.component.scss']
})
export class SaleItemGridItemComponent implements OnInit {

  @Input()
  item: WsItemVariantSale;

  constructor() {
  }

  ngOnInit() {
  }

}
