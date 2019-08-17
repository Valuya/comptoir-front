import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WsSaleSearch} from '@valuya/comptoir-ws-api';
import {DateRange} from '../../domain/util/date-range-select/date-range';
import {BehaviorSubject, Observable} from 'rxjs';
import {MenuItem} from 'primeng/api';
import {map, publishReplay, refCount} from 'rxjs/operators';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleFilterComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;

  valueSource$ = new BehaviorSubject<WsSaleSearch | null>(null);
  dateRange$: Observable<DateRange | null>;

  openTabsMenuModel: MenuItem[];
  activeOpenTabItem$: Observable<MenuItem>;

  private onChange: (value: WsSaleSearch) => void;
  private onTouched: () => void;

  constructor() {
  }

  ngOnInit() {
    const openMenuItem = {
      label: 'Open sales',
      command: () => this.updateValue({
        closed: false
      })
    };
    const closedMenuItem = {
      label: 'Closed sales',
      command: () => this.updateValue({
        closed: true
      })
    };
    this.openTabsMenuModel = [
      openMenuItem,
      closedMenuItem
    ];
    this.activeOpenTabItem$ = this.valueSource$.pipe(
      map(searchFilter => searchFilter.closed),
      map(closedvalue => {
        if (closedvalue === true) {
          return closedMenuItem;
        } else if (closedvalue === false) {
          return openMenuItem;
        } else {
          return null;
        }
      }),
      publishReplay(1), refCount()
    );
    this.dateRange$ = this.valueSource$.pipe(
      map(searchFilter => this.getDateRange(searchFilter)),
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
