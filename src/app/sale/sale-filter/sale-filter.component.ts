import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WsSaleSearch} from '@valuya/comptoir-ws-api';
import {DateRange} from '../../domain/util/date-range-select/date-range';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'cp-sale-filter',
  templateUrl: './sale-filter.component.html',
  styleUrls: ['./sale-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SaleFilterComponent,
      multi: true
    }
  ]
})
export class SaleFilterComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;

  valueSource$ = new BehaviorSubject<WsSaleSearch | null>(null);
  dateRange$: Observable<DateRange | null>;

  private onChange: (value: WsSaleSearch) => void;
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

  updateValue(update: Partial<WsSaleSearch>) {
    const curValue = this.valueSource$.getValue();
    const newValue = Object.assign({}, curValue, update);
    this.fireChanges(newValue);
  }

  getDateRange(value: WsSaleSearch): DateRange {
    return {
      from: value == null ? null : value.fromDateTime,
      until: value == null ? null : value.toDateTime
    };
  }

  updateDateRange(range: DateRange | null) {
    if (range == null) {
      this.updateValue(null);
    } else {
      this.updateValue({
        fromDateTime: range.from,
        toDateTime: range.until,
      });
    }
  }

  private fireChanges(newValue: WsSaleSearch) {
    this.valueSource$.next(newValue);
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }
}
