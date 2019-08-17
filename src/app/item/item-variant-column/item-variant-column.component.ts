import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TableColumn} from '../../util/table-column';
import {WsItemVariant} from '@valuya/comptoir-ws-api';
import {ItemVariantColumn} from './item-variant-columns';

@Component({
  selector: 'cp-item-variant-column',
  templateUrl: './item-variant-column.component.html',
  styleUrls: ['./item-variant-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemVariantColumnComponent implements OnInit {

  @Input()
  row: WsItemVariant;
  @Input()
  column: TableColumn<ItemVariantColumn>;

  constructor() { }

  ngOnInit() {
  }

}
