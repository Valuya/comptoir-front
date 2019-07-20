import {Component, Input, OnInit} from '@angular/core';
import {WsAccount, WsAccountRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ApiService} from '../../../api.service';
import {publishReplay, refCount, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'cp-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @Input()
  set ref(value: WsAccountRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsAccountRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsAccount>;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsAccountRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    const loaded$ = this.apiService.api.getAccount({
      id: ref.id
    }) as any as Observable<WsAccount>;
    return loaded$.pipe(
      tap(def => this.loading$.next(false))
    );
  }

}
