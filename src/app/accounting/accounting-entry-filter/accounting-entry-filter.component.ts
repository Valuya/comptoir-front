import {Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BehaviorSubject, Observable} from 'rxjs';
import {WsAccountingEntrySearch, WsAccountSearch} from '@valuya/comptoir-ws-api';
import {DateRange} from '../../domain/util/date-range-select/date-range';
import {map, publishReplay, refCount} from 'rxjs/operators';

@Component({
  selector: 'cp-accounting-entry-filter',
  templateUrl: './accounting-entry-filter.component.html',
  styleUrls: ['./accounting-entry-filter.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AccountingEntryFilterComponent,
      multi: true
    }
  ]
})
export class AccountingEntryFilterComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;

  valueSource$ = new BehaviorSubject<WsAccountingEntrySearch | null>(null);
  dateRange$: Observable<DateRange | null>;
  accountSearch$: Observable<WsAccountSearch | null>;


  private onChange: (value: WsAccountingEntrySearch) => void;
  private onTouched: () => void;

  constructor() {
  }

  ngOnInit() {
    this.dateRange$ = this.valueSource$.pipe(
      map(searchFilter => this.getDateRange(searchFilter)),
      publishReplay(1), refCount()
    );
    this.accountSearch$ = this.valueSource$.pipe(
      map(f => f.accountSearch as any as WsAccountSearch),
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

  updateAccountSearch(update: Partial<WsAccountSearch>) {
    const curValue = this.valueSource$.getValue().accountSearch;
    const newValue = Object.assign({}, curValue, update);
    this.updateValue({
      accountSearch: newValue
    });
  }

  updateValue(update: Partial<WsAccountingEntrySearch>) {
    const curValue = this.valueSource$.getValue();
    const newValue = Object.assign({}, curValue, update);
    this.fireChanges(newValue);
  }

  updateDateRange(range: DateRange | null) {
    if (range == null) {
      this.updateValue({
        fromDateTime: null,
        toDateTime: null
      });
    } else {
      this.updateValue({
        fromDateTime: range.from,
        toDateTime: range.until,
      });
    }
  }

  private fireChanges(newValue: WsAccountingEntrySearch) {
    this.valueSource$.next(newValue);
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }

  private getDateRange(value: WsAccountingEntrySearch): DateRange {
    return {
      from: value == null ? null : value.fromDateTime,
      until: value == null ? null : value.toDateTime
    };
  }


}
