import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {distinctUntilChanged, map, publishReplay, refCount} from 'rxjs/operators';
import {LocaleService} from '../../../locale.service';
import * as moment from 'moment';
import {DateUtils} from '../../../util/date-utils';

@Component({
  selector: 'cp-date-select',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DateSelectComponent,
    multi: true
  }]
})
export class DateSelectComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;
  @Input()
  showTime: boolean;

  valueSource$ = new BehaviorSubject<string | null>(null);
  dateValue$: Observable<Date>;
  stringValue$: Observable<string>;
  locale$: Observable<string>;

  private onChange: (value: string) => void;
  private onTouched: () => void;

  constructor(private localeService: LocaleService) {
  }

  ngOnInit() {
    this.locale$ = this.localeService.getViewLocale$();
    this.dateValue$ = this.valueSource$.pipe(
      distinctUntilChanged(),
      map(dateString => this.parseDate(dateString)),
      publishReplay(1), refCount()
    );
    this.stringValue$ = this.dateValue$.pipe(
      map(date => DateUtils.formatDateString(date)),
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

  onStringValueChange(value: string) {
    const momentValue = moment(value);
    const dateValue = momentValue.toDate();
    this.fireChanges(dateValue);
  }

  fireChanges(newValue: Date) {
    const dateString = newValue.toISOString();
    this.valueSource$.next(dateString);

    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(dateString);
    }
  }

  private parseDate(dateString: string) {
    if (dateString == null) {
      return new Date();
    }
    const unixTime = Date.parse(dateString);
    if (unixTime == null || isNaN(unixTime)) {
      return new Date();
    }
    return new Date(unixTime);
  }
}
