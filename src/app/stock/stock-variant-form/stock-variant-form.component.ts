import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsItemVariantStock} from '@valuya/comptoir-ws-api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';

@Component({
  selector: 'cp-stock-variant-form',
  templateUrl: './stock-variant-form.component.html',
  styleUrls: ['./stock-variant-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: StockVariantFormComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StockVariantFormComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  validationResults: ValidationResult<WsItemVariantStock>;

  @Output()
  partialUpdate = new EventEmitter<Partial<WsItemVariantStock>>();

  value: WsItemVariantStock;

  private onChange: (value: WsItemVariantStock) => void;
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

  updateValue(update: Partial<WsItemVariantStock>) {
    this.partialUpdate.emit(update);
    const newValue = Object.assign({}, this.value, update);
    this.fireChanges(newValue);
  }

  private fireChanges(newValue: WsItemVariantStock) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }
}
