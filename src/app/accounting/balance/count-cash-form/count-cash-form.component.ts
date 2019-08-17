import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SelectItem} from 'primeng/api';
import {CountCashRow} from './count-cash-row';
import {WsBalance, WsBalanceRef, WsMoneyPile} from '@valuya/comptoir-ws-api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'cp-count-cash-form',
  templateUrl: './count-cash-form.component.html',
  styleUrls: ['./count-cash-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CountCashFormComponent,
      multi: true
    }
  ],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountCashFormComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled: boolean;
  @Input()
  balanceRef: WsBalanceRef;
  @Input()
  accountRef: WsBalanceRef;

  @Output()
  pilesChanged = new EventEmitter<Partial<WsMoneyPile[]>>();

  value: WsMoneyPile[];

  private onChange: (value: WsMoneyPile[]) => void;
  private onTouched: () => void;


  constructor() {
  }

  ngOnInit() {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: any): void {
    this.value = obj;
  }

  onQuantityChange(index: number, quantity: number) {
    const moneyPile = this.value[index];
    moneyPile.count = quantity;
    moneyPile.total = quantity * moneyPile.unitAmount;
    this.fireChanges([...this.value]);
  }

  private fireChanges(piles: WsMoneyPile[]) {
    this.value = piles;
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(piles);
    }
  }
}
