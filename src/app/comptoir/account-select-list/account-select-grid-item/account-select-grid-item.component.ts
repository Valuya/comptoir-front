import {Component, Input, OnInit} from '@angular/core';
import {WsAccount, WsAccountRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'cp-account-select-grid-item',
  templateUrl: './account-select-grid-item.component.html',
  styleUrls: ['./account-select-grid-item.component.scss']
})
export class AccountSelectGridItemComponent implements OnInit {

  @Input()
  set ref(value: WsAccountRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsAccountRef | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);
  account$: Observable<WsAccount>;

  constructor() {
  }

  ngOnInit() {
  }

}
