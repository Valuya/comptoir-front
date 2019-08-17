import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {WsStock, WsStockRef} from '@valuya/comptoir-ws-api';
import {StockService} from '../stock.service';

@Component({
  selector: 'cp-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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

  constructor(
    private stockService: StockService,
  ) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsStockRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    return this.stockService.getStock$(ref).pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}
