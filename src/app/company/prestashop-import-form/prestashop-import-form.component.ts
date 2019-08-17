import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {WsCompany, WsPrestashopImportParams} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-prestashop-import-form',
  templateUrl: './prestashop-import-form.component.html',
  styleUrls: ['./prestashop-import-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: PrestashopImportFormComponent,
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestashopImportFormComponent implements OnInit, ControlValueAccessor {


  @Input()
  disabled = false;
  @Input()
  validationResults: ValidationResult<WsPrestashopImportParams>;

  @Output()
  partialUpdate = new EventEmitter<Partial<WsPrestashopImportParams>>();

  value: WsPrestashopImportParams;

  private onChange: (value: WsPrestashopImportParams) => void;
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

  updateValue(update: Partial<WsPrestashopImportParams>) {
    this.partialUpdate.emit(update);
    const newValue = Object.assign({}, this.value, update);
    this.fireChanges(newValue);
  }

  private fireChanges(newValue: WsPrestashopImportParams) {
    this.value = newValue;
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }

}
