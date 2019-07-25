import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ApiService} from '../../../api.service';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {WsStock, WsStockRef} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  @Input()
  set ref(value: WsStockRef) {
    this.refSource$.next(value);
  }
  @Input()
  showIcon: boolean;
  @Input()
  showDescription: boolean;

  private refSource$ = new BehaviorSubject<WsStockRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsStock>;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsStockRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    const loaded$ = this.apiService.api.getStock({
      id: ref.id
    }) as any as Observable<WsStock>;
    return loaded$.pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}
