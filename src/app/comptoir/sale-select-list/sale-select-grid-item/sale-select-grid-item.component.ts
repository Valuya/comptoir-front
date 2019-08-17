import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsItemVariantRef} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-sale-select-grid-item',
  templateUrl: './sale-select-grid-item.component.html',
  styleUrls: ['./sale-select-grid-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleSelectGridItemComponent implements OnInit {

  @Input()
  set ref(value: WsItemVariantRef) {
  }

  constructor() { }

  ngOnInit() {
  }

}
