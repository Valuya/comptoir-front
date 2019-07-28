import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsItemVariantSale} from '@valuya/comptoir-ws-api';
import {PricingUtils} from '../../../domain/util/pricing-utils';

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

  fireTotalChange(totalValue: number) {
    const curVatRate = this.item.vatRate;
    const newVatExclusive = PricingUtils.vatExclusviveFromTotal(totalValue, curVatRate);
    return this.fireChanges({
      total: totalValue,
      vatExclusive: newVatExclusive
    });
  }

  fireVatExclusiveChange(vatExclusiveValue: number) {
    const curVatRate = this.item.vatRate;
    const newTotal = PricingUtils.totalFromVatExclusive(vatExclusiveValue, curVatRate);
    return this.fireChanges({
      total: newTotal,
      vatExclusive: vatExclusiveValue
    });
  }


  fireVatRateChange(vatRateValue: number) {
    const curVatExclusive = this.item.vatExclusive;
    const newTotal = PricingUtils.totalFromVatExclusive(curVatExclusive, vatRateValue);
    return this.fireChanges({
      total: newTotal,
      vatRate: vatRateValue
    });
  }
}
