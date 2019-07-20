import {Component, Input, OnInit} from '@angular/core';
import {WsCustomer, WsCustomerRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ApiService} from '../../../api.service';
import {publishReplay, refCount, switchMap, tap} from 'rxjs/operators';

@Component({
  selector: 'cp-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  @Input()
  set ref(value: WsCustomerRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsCustomerRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsCustomer>;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsCustomerRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    const loaded$ = this.apiService.api.getCustomer({
      id: ref.id
    }) as any as Observable<WsCustomer>;
    return loaded$.pipe(
      tap(def => this.loading$.next(false))
    );
  }
}
