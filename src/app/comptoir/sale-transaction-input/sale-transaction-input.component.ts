import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsAccountingEntry, WsAccountRef, WsPosRef} from '@valuya/comptoir-ws-api';
import {NumberUtils} from '../../util/number-utils';

@Component({
  selector: 'cp-sale-transaction-input',
  templateUrl: './sale-transaction-input.component.html',
  styleUrls: ['./sale-transaction-input.component.scss']
})
export class SaleTransactionInputComponent implements OnInit {

  @Input()
  posRef: WsPosRef;
  @Input()
  transactionAmount: number;
  @Output()
  transactionAdded = new EventEmitter<WsAccountingEntry>();

  selectedAccountRef: WsAccountRef | null;

  constructor() {
  }

  ngOnInit() {
  }

  onAccountSelected(accountRef: WsAccountRef) {
    this.selectedAccountRef = accountRef;
  }

  onAmountSubmit() {
    const transaction = this.createTransaction();
    this.transactionAdded.next(transaction);
    this.selectedAccountRef = null;
    this.transactionAmount = 0;
  }

  onCancelAccountClick() {
    this.selectedAccountRef = null;
  }

  private createTransaction(): WsAccountingEntry {
    return {
      accountRef: this.selectedAccountRef,
      amount: NumberUtils.toFixedDecimals(this.transactionAmount, 4),
      dateTime: new Date(),
      description: [],
      accountingTransactionRef: null,
      companyRef: null,
      customerRef: null,
      id: null,
      vatAccountingEntryRef: null,
      vatRate: null
    };
  }

}
