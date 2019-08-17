import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsCustomer, WsCustomerRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {CustomerService} from '../customer.service';

@Component({
  selector: 'cp-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerComponent implements OnInit {
  @Input()
  set ref(value: WsCustomerRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsCustomerRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsCustomer>;

  constructor(private customerService: CustomerService) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsCustomerRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    return this.customerService.getCustomer$(ref).pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}
