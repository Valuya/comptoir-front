import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {NumberUtils} from '../../../util/number-utils';

@Component({
  selector: 'cp-percent-input',
  templateUrl: './percent-input.component.html',
  styleUrls: ['./percent-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PercentInputComponent,
    multi: true
  }]
})
export class PercentInputComponent implements OnInit, ControlValueAccessor {
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
    const percentValue = NumberUtils.toFixedDecimals(obj * 100, 0);
    this.valueSource$.next(percentValue);
  }

  fireChanges(newValue: number) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }

  onPercentChange(percentValue: number) {
    this.valueSource$.next(percentValue);
    const value = NumberUtils.toFixedDecimals(percentValue / 100, 2);
    this.fireChanges(value);
  }
}
