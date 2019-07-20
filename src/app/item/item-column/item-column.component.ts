import {Component, Input, OnInit} from '@angular/core';
import {TableColumn} from '../../util/table-column';
import {ItemColumn} from '../../item/item-column/item-columns';
import {WsItem} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-item-column',
  templateUrl: './item-column.component.html',
  styleUrls: ['./item-column.component.scss']
})
export class ItemColumnComponent implements OnInit {

  @Input()
  row: WsItem;
  @Input()
  column: TableColumn<ItemColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
