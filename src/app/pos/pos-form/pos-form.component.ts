import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsPos} from '@valuya/comptoir-ws-api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';

@Component({
  selector: 'cp-pos-form',
  templateUrl: './pos-form.component.html',
  styleUrls: ['./pos-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PosFormComponent,
      multi: true
    }
  ]
})
export class PosFormComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  validationResults: ValidationResult<WsPos>;

  @Output()
  partialUpdate = new EventEmitter<Partial<WsPos>>();

  value: WsPos;

  private onChange: (value: WsPos) => void;
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

  updateValue(update: Partial<WsPos>) {
    this.partialUpdate.emit(update);
    const newValue = Object.assign({}, this.value, update);
    this.fireChanges(newValue);
  }

  private fireChanges(newValue: WsPos) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }
}
