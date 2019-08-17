import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsAccount, WsAccountRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {AccountService} from '../../../domain/accounting/account.service';

@Component({
  selector: 'cp-account-select-list-item',
  templateUrl: './account-select-list-item.component.html',
  styleUrls: ['./account-select-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountSelectListItemComponent implements OnInit {

  @Input()
  set ref(value: WsAccountRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsAccountRef | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);
  account$: Observable<WsAccount>;

  constructor(
    private accountService: AccountService,
  ) {
  }

  ngOnInit() {
    this.account$ = this.refSource$.pipe(
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
    const loaded$ = this.accountService.getAccount$(ref);
    return loaded$.pipe(
      delay(0),
      tap(() => this.loading$.next(false))
    );
  }
}
