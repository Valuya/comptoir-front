import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {WsAccountAccountTypeEnum} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../../auth.service';
import {map, publishReplay, refCount} from 'rxjs/operators';
import {AccountTypeSelectItem} from './account-type-select-item';
import {AccountTypeService} from '../account-type.service';

@Component({
  selector: 'cp-account-type-select',
  templateUrl: './account-type-select.component.html',
  styleUrls: ['./account-type-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: AccountTypeSelectComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountTypeSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;
  @Input()
  includeNoSelectionOption = true;

  valueSource$ = new BehaviorSubject<WsAccountAccountTypeEnum | null>(null);
  valueItem$: Observable<AccountTypeSelectItem | null>;
  options: AccountTypeSelectItem[];

  private onChange: (value: WsAccountAccountTypeEnum) => void;
  private onTouched: () => void;

  constructor(
    private accountTypeService: AccountTypeService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    this.options = this.createSelectItems();
    this.valueItem$ = this.valueSource$.pipe(
      map(type => this.findSelectItem(type)),
      publishReplay(1), refCount()
    );
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

  fireChanges(newValue: WsAccountAccountTypeEnum) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }

  private findSelectItem(type: WsAccountAccountTypeEnum): AccountTypeSelectItem | null {
    return this.options.find(o => o.type === type);
  }

  private createSelectItems() {
    const items = [
      WsAccountAccountTypeEnum.PAYMENT,
      WsAccountAccountTypeEnum.VAT,
      WsAccountAccountTypeEnum.OTHER
    ].map(typeValue => {
      const labelValue = this.accountTypeService.getLabel(typeValue);
      return {
        label: labelValue,
        type: typeValue
      } as AccountTypeSelectItem;
    });
    const noSelectionItem: AccountTypeSelectItem = {
      type: null,
      label: 'Aucun'
    };
    if (this.includeNoSelectionOption) {
      return [noSelectionItem, ...items];
    } else {
      return items;
    }
  }
}
