import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DateRange} from './date-range';
import {SelectItem} from 'primeng/api';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import * as moment from 'moment';
import {DateUtils} from '../../../util/date-utils';

@Component({
  selector: 'cp-date-range-select',
  templateUrl: './date-range-select.component.html',
  styleUrls: ['./date-range-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DateRangeSelectComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangeSelectComponent implements OnInit {

  @Input()
  disabled: boolean;
  @Input()
  showSuggestions: boolean;
  @Input()
  showFreeRange: boolean;

  value: DateRange | null;

  suggestions: SelectItem[] = [];

  private onChange: (value: DateRange) => void;
  private onTouched: () => void;

  constructor() {
  }

  ngOnInit() {
    this.suggestions = this.createSuggestions();
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

  onValueChange(newvalue: DateRange) {
    this.value = newvalue;
    this.fireChanges(newvalue);
  }

  updateValue(update: Partial<DateRange>) {
    const newValue = Object.assign({}, this.value, update);
    this.value = newValue;
    this.fireChanges(newValue);
  }

  private createSuggestions() {
    const now = moment();
    const startOfDay = now.clone().startOf('day');
    const startOfWeek = now.clone().startOf('week');
    const startOfMonth = now.clone().startOf('month');

    const todayRange: DateRange = {
      from: startOfDay.toDate(),
      until: startOfDay.clone().add(1, 'day').toDate()
    };
    const yesterdayRange: DateRange = {
      from: startOfDay.clone().add(-1, 'day').toDate(),
      until: startOfDay.toDate()
    };
    const thisWeekRange: DateRange = {
      from: startOfWeek.toDate(),
      until: startOfWeek.clone().add(1, 'week').toDate()
    };
    const lastWeekRange: DateRange = {
      from: startOfWeek.clone().add(-1, 'week').toDate(),
      until: startOfWeek.toDate()
    };
    const thisMonthRange: DateRange = {
      from: startOfMonth.toDate(),
      until: startOfMonth.clone().add(1, 'month').toDate()
    };
    const lastMonthRange: DateRange = {
      from: startOfMonth.clone().add(-1, 'month').toDate(),
      until: startOfMonth.toDate(),
    };
    const ranges: DateRange[] = [
      lastMonthRange,
      thisMonthRange,
      lastWeekRange,
      thisWeekRange,
      yesterdayRange,
      todayRange,
    ];
    return ranges.map(r => DateUtils.getDateRangeSelectItem(r));
  }

  private fireChanges(newValue: DateRange) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }
}
