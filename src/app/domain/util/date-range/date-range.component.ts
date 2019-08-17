import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {DateRange} from '../date-range-select/date-range';
import {BehaviorSubject, Observable} from 'rxjs';
import {map, publishReplay, refCount} from 'rxjs/operators';
import {DateUtils} from '../../../util/date-utils';
import {SelectItem} from 'primeng/api';

@Component({
  selector: 'cp-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DateRangeComponent implements OnInit {

  @Input()
  set range(value: DateRange) {
    this.valueSource$.next(value);
  }

  valueSource$ = new BehaviorSubject<DateRange | null>(null);
  selectItem$: Observable<SelectItem>;

  constructor() {
  }

  ngOnInit() {
    this.selectItem$ = this.valueSource$.pipe(
      map(range => DateUtils.getDateRangeSelectItem(range)),
      publishReplay(1), refCount()
    );
  }

}
