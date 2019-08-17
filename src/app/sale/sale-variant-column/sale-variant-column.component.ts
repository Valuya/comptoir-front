import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TableColumn} from '../../util/table-column';
import {WsItemVariantSale} from '@valuya/comptoir-ws-api';
import {SaleVariantColumn} from './sale-variant-columns';
import {PricingUtils} from '../../domain/util/pricing-utils';
import {VariantSaleWithPrice} from '../../domain/commercial/item-variant-sale/variant-sale-with-price';

@Component({
  selector: 'cp-sale-variant-column',
  templateUrl: './sale-variant-column.component.html',
  styleUrls: ['./sale-variant-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleVariantColumnComponent implements OnInit {

  @Input()
  variantWithPrice: VariantSaleWithPrice;
  @Input()
  column: TableColumn<SaleVariantColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
