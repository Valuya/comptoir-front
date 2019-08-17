import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsSale} from '@valuya/comptoir-ws-api';
import {WsSalePriceDetails} from '@valuya/comptoir-ws-api/dist/models/WsSalePriceDetails';

@Component({
  selector: 'cp-active-sale-details',
  templateUrl: './active-sale-details.component.html',
  styleUrls: ['./active-sale-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveSaleDetailsComponent implements OnInit {

  @Input()
  sale: WsSale;
  @Input()
  salePrice: WsSalePriceDetails;
  @Input()
  saleTotalPaid: number;

  @Input()
  showTotalDetails = false;
  @Input()
  showPaymentdDetails = false;

  @Output()
  saleUpdate = new EventEmitter<Partial<WsSale>>();
  @Output()
  discountRatioChange = new EventEmitter<number>();
  @Output()
  discountAmountChange = new EventEmitter<number>();
  @Output()
  totalVatInclusiveChange = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit() {
  }

  onDiscountRateChange(value: number) {
    this.discountRatioChange.next(value);
  }

  onDiscountAmountChange(value: number) {
    this.discountAmountChange.next(value);
  }

  onTotalVatInclusiveChange(value: number) {
    this.totalVatInclusiveChange.next(value);
  }

  fireChanges(update: Partial<WsSale>) {
    this.saleUpdate.emit(update);
  }

}
