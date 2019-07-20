import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ApiService} from '../../../api.service';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {WsSale, WsSaleRef} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.scss']
})
export class SaleComponent implements OnInit {

  @Input()
  set ref(value: WsSaleRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsSaleRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsSale>;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsSaleRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    const loaded$ = this.apiService.api.getSale({
      id: ref.id
    }) as any as Observable<WsSale>;
    return loaded$.pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}
