import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsStock} from '@valuya/comptoir-ws-api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';

@Component({
  selector: 'cp-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: StockFormComponent,
      multi: true
    }
  ]
})
export class StockFormComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  validationResults: ValidationResult<WsStock>;

  @Output()
  partialUpdate = new EventEmitter<Partial<WsStock>>();

  value: WsStock;

  private onChange: (value: WsStock) => void;
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

  updateValue(update: Partial<WsStock>) {
    this.partialUpdate.emit(update);
    const newValue = Object.assign({}, this.value, update);
    this.fireChanges(newValue);
  }

  private fireChanges(newValue: WsStock) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }
}
