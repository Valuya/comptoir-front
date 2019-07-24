import {Component, Input, OnInit} from '@angular/core';
import {WsItemVariantRef} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-variant-select-grid-item',
  templateUrl: './variant-select-grid-item.component.html',
  styleUrls: ['./variant-select-grid-item.component.scss']
})
export class VariantSelectGridItemComponent implements OnInit {

  @Input()
  set ref(value: WsItemVariantRef) {
  }

  constructor() { }

  ngOnInit() {
  }

}
