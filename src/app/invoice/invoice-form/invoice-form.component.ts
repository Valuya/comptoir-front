import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsInvoice} from '@valuya/comptoir-ws-api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';

@Component({
  selector: 'cp-invoice-form',
  templateUrl: './invoice-form.component.html',
  styleUrls: ['./invoice-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InvoiceFormComponent,
      multi: true
    }
  ]
})
export class InvoiceFormComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  validationResults: ValidationResult<WsInvoice>;

  @Output()
  partialUpdate = new EventEmitter<Partial<WsInvoice>>();

  value: WsInvoice;

  private onChange: (value: WsInvoice) => void;
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

  updateValue(update: Partial<WsInvoice>) {
    this.partialUpdate.emit(update);
    const newValue = Object.assign({}, this.value, update);
    this.fireChanges(newValue);
  }

  private fireChanges(newValue: WsInvoice) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }
}
