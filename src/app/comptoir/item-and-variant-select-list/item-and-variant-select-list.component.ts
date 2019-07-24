import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsItemRef, WsItemVariantRef} from '@valuya/comptoir-ws-api';
import {$e} from 'codelyzer/angular/styles/chars';

@Component({
  selector: 'cp-item-and-variant-select-list',
  templateUrl: './item-and-variant-select-list.component.html',
  styleUrls: ['./item-and-variant-select-list.component.scss']
})
export class ItemAndVariantSelectListComponent implements OnInit {

  @Input()
  autoSelectSingleVariant = true;

  @Output()
  variantSelect$ = new EventEmitter<WsItemVariantRef>();

  selectionType: 'item' | 'variant' = 'item';
  displayMode: 'list' | 'grid' = 'list';

  private itemRef: WsItemRef | null;

  constructor() {
  }

  ngOnInit() {
  }

  onItemSelected(ref: WsItemRef) {
    this.itemRef = ref;
    this.selectionType = 'variant';
  }

  onVariantSelected(ref: WsItemVariantRef) {
    this.variantSelect$.next(ref);
    this.selectionType = 'item';
    this.itemRef = null;
  }
}
