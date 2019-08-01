import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {NumberUtils} from '../../../util/number-utils';

@Component({
  selector: 'cp-currency-input',
  templateUrl: './currency-input.component.html',
  styleUrls: ['./currency-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CurrencyInputComponent,
    multi: true
  }]
})
export class CurrencyInputComponent implements OnInit, ControlValueAccessor {
  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  valueSource$ = new BehaviorSubject<number | null>(null);

  private onChange: (value: number) => void;
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
    const currencyValue = NumberUtils.toFixedDecimals(obj, 2);
    this.valueSource$.next(currencyValue);
  }

  fireChanges(newValue: number) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {      this.onChange(newValue);
    }
  }

  onCurrencyChange(currencyValue: number) {
    this.valueSource$.next(currencyValue);
    const value = NumberUtils.toFixedDecimals(currencyValue, 2);
    this.fireChanges(value);
  }
}
