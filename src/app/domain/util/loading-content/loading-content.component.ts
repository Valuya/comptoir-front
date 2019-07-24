import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {debounceTime, delay, map, publishReplay, refCount, tap} from 'rxjs/operators';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'cp-loading-content',
  templateUrl: './loading-content.component.html',
  styleUrls: ['./loading-content.component.scss']
})
export class LoadingContentComponent implements OnInit {

  @Input()
  set loading(value: boolean) {
    this.loading$.next(value);
  }

  loading$ = new BehaviorSubject<boolean>(true);
  reallyLoading$: Observable<boolean>;

  constructor() {
  }

  ngOnInit() {
    this.reallyLoading$ = this.loading$.pipe(
      debounceTime(200),
      publishReplay(1), refCount()
    );
  }

}
