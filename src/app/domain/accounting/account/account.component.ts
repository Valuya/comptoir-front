import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsAccount, WsAccountRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {AccountService} from '../account.service';

@Component({
  selector: 'cp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountComponent implements OnInit {

  @Input()
  set ref(value: WsAccountRef) {
    this.refSource$.next(value);
  }

  @Input()
  showIcon = true;
  @Input()
  showName = true;
  @Input()
  showDescription = false;
  @Input()
  showNumber = false;

  private refSource$ = new BehaviorSubject<WsAccountRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsAccount>;

  constructor(
    private accountService: AccountService,
  ) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsAccountRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    return this.accountService.getAccount$(ref).pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }

}
