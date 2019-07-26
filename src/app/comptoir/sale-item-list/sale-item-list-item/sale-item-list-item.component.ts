import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsItemVariantSale} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-sale-item-list-item',
  templateUrl: './sale-item-list-item.component.html',
  styleUrls: ['./sale-item-list-item.component.scss']
})
export class SaleItemListItemComponent implements OnInit {

  @Input()
  item: WsItemVariantSale;

  @Output()
  itemChange = new EventEmitter<WsItemVariantSale>();

  constructor() {
  }

  ngOnInit() {
  }

  fireChanges(update: Partial<WsItemVariantSale>) {
    const newValue = Object.assign({}, this.item, update);
    this.itemChange.next(newValue);
  }

}
