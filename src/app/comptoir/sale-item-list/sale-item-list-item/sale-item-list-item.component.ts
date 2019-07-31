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
    const unitPrice = NumberUtils.toFixedDecimals(totalValue / quantity, 2);
    return this.fireChanges({
      total: totalValue,
      vatExclusive: unitPrice
    });
  }


  fireTotalVatInclusiveChange(totalValue: number) {
    const vatRate = this.item.vatRate;
    const totalVatExclusive = PricingUtils.vatExclusviveFromTotal(totalValue, vatRate);
    const quantity = this.item.quantity;
    const unitPrice = NumberUtils.toFixedDecimals(totalVatExclusive / quantity, 2);
    return this.fireChanges({
      total: totalVatExclusive,
      vatExclusive: unitPrice
    });
  }

  fireVatExclusiveChange(vatExclusiveValue: number) {
    const quantity = this.item.quantity;
    const totalValue = NumberUtils.toFixedDecimals(quantity * vatExclusiveValue);
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
}
