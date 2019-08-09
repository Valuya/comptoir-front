import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsItemVariantSale} from '@valuya/comptoir-ws-api';
import {PricingUtils} from '../../../domain/util/pricing-utils';
import {NumberUtils} from '../../../util/number-utils';

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
  @Output()
  itemRemove = new EventEmitter<WsItemVariantSale>();

  constructor() {
  }

  ngOnInit() {
  }

  fireChanges(update: Partial<WsItemVariantSale>) {
    const newValue = Object.assign({}, this.item, update);
    this.itemChange.next(newValue);
  }

  fireTotalVatExclusiveChange(totalValue: number) {
    const quantity = this.item.quantity;
    const unitPrice = NumberUtils.toFixedDecimals(totalValue / quantity, 4);
    return this.fireChanges({
      total: totalValue,
      vatExclusive: unitPrice
    });
  }


  fireTotalVatInclusiveChange(totalValue: number) {
    const vatRate = this.item.vatRate;
    const discountRate = this.item.discountRatio;
    const totalVatExclusive = PricingUtils.vatExclusviveFromTotal(totalValue, vatRate, discountRate);
    const quantity = this.item.quantity;
    const unitPrice = NumberUtils.toFixedDecimals(totalVatExclusive / quantity, 4);
    return this.fireChanges({
      total: totalVatExclusive,
      vatExclusive: unitPrice
    });
  }

  fireVatExclusiveChange(vatExclusiveValue: number) {
    const quantity = this.item.quantity;
    const totalValue = NumberUtils.toFixedDecimals(quantity * vatExclusiveValue, 4);
    return this.fireChanges({
      total: totalValue,
      vatExclusive: vatExclusiveValue
    });
  }


  fireVatRateChange(vatRateValue: number) {
    return this.fireChanges({
      vatRate: vatRateValue
    });
  }

  onRemoveItemClick(event: Event) {
    this.itemRemove.next(this.item);
  }

  onDiscountAmountChange(amount: number): number {
    const discountAmount = PricingUtils.getDiscountRateFromAmount(this.item, amount);
    return discountAmount;
  }
}
