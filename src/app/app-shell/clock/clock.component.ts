import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {interval, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Component({
  selector: 'cp-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClockComponent implements OnInit {

  currentTime$: Observable<Date>;

  constructor() {
  }

  ngOnInit() {
    this.currentTime$ = interval(1000).pipe(
      map(() => Date.now()),
      map(nowTime => new Date(nowTime))
    );
  }

}
