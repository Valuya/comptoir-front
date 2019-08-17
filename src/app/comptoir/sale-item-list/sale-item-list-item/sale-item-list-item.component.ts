import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsItemVariantSale} from '@valuya/comptoir-ws-api';
import {WsItemVariantSalePriceDetails} from '@valuya/comptoir-ws-api/dist/models/WsItemVariantSalePriceDetails';

@Component({
  selector: 'cp-sale-item-list-item',
  templateUrl: './sale-item-list-item.component.html',
  styleUrls: ['./sale-item-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SaleItemListItemComponent implements OnInit {

  @Input()
  item: WsItemVariantSale;
  @Input()
  priceDetails: WsItemVariantSalePriceDetails;

  @Output()
  itemChange = new EventEmitter<WsItemVariantSale>();
  @Output()
  itemRemove = new EventEmitter<WsItemVariantSale>();
  @Output()
  totalVatExclusiveChange = new EventEmitter<number>();
  @Output()
  totalVatInclusiveChange = new EventEmitter<number>();
  @Output()
  unitVatExclusiveChange = new EventEmitter<number>();
  @Output()
  vatRateChange = new EventEmitter<number>();
  @Output()
  discountRateChange = new EventEmitter<number>();
  @Output()
  discountAmountChange = new EventEmitter<number>();
  @Output()
  quantityChange = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  fireChanges(update: Partial<WsItemVariantSale>) {
    const newValue = Object.assign({}, this.item, update);
    this.itemChange.next(newValue);
  }

  fireTotalVatExclusiveChange(totalValue: number) {
    this.totalVatExclusiveChange.next(totalValue);
  }

  fireTotalVatInclusiveChange(totalValue: number) {
    this.totalVatInclusiveChange.next(totalValue);
  }

  fireVatExclusiveChange(vatExclusiveValue: number) {
    this.unitVatExclusiveChange.next(vatExclusiveValue);
  }

  fireVatRateChange(vatRateValue: number) {
    this.vatRateChange.next(vatRateValue);
  }

  fireDiscountAmountChange(value: number) {
    this.discountAmountChange.next(value);
  }

  fireDiscountRateChange(value: number) {
    this.discountRateChange.next(value);
  }

  fireQuantityChange(value: number) {
    this.quantityChange.next(value);
  }

  onRemoveItemClick(event: Event) {
    this.itemRemove.next(this.item);
  }

}
