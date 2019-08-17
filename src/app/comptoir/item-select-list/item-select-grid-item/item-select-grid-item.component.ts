import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsItemRef} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-item-select-grid-item',
  templateUrl: './item-select-grid-item.component.html',
  styleUrls: ['./item-select-grid-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemSelectGridItemComponent implements OnInit {

  @Input()
  ref: WsItemRef;

  constructor() { }

  ngOnInit() {
  }

}
