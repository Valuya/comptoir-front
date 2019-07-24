import {Component, Input, OnInit} from '@angular/core';
import {WsItemVariantSale} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-sale-item-list-item',
  templateUrl: './sale-item-list-item.component.html',
  styleUrls: ['./sale-item-list-item.component.scss']
})
export class SaleItemListItemComponent implements OnInit {

  @Input()
  item: WsItemVariantSale;

  constructor() { }

  ngOnInit() {
  }

}
