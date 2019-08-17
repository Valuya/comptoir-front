import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsBalance} from '@valuya/comptoir-ws-api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValidationResult} from '../../../app-shell/shell-details-form/validation-result';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'cp-balance-form',
  templateUrl: './balance-form.component.html',
  styleUrls: ['./balance-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: BalanceFormComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceFormComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  validationResults: ValidationResult<WsBalance>;
  @Input()
  countCashVisible: boolean;

  valueSource$ = new BehaviorSubject<WsBalance | null>(null);


  private onChange: (value: WsBalance) => void;
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
    this.valueSource$.next(obj);
  }

  updateValue(update: Partial<WsBalance>) {
    const curValue = this.valueSource$.getValue();
    const newValue = Object.assign({}, curValue, update);
    this.fireChanges(newValue);
  }


  private fireChanges(newValue: WsBalance) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }


}
