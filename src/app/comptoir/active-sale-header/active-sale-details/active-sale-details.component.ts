import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsSale} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-active-sale-details',
  templateUrl: './active-sale-details.component.html',
  styleUrls: ['./active-sale-details.component.scss']
})
export class ActiveSaleDetailsComponent implements OnInit {

  @Input()
  sale: WsSale;
  @Input()
  saleTotalPaid: number;

  @Input()
  showTotalDetails = false;
  @Input()
  showPaymentdDetails = false;

  @Output()
  saleUpdate = new EventEmitter<Partial<WsSale>>();

  constructor() {
  }

  ngOnInit() {
  }

  fireChanges(update: Partial<WsSale>) {
    this.saleUpdate.emit(update);
  }
}
