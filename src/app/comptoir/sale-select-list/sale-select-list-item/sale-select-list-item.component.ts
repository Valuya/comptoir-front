import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsSale, WsSaleRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {SaleService} from '../../../domain/commercial/sale.service';

@Component({
  selector: 'cp-sale-select-list-item',
  templateUrl: './sale-select-list-item.component.html',
  styleUrls: ['./sale-select-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleSelectListItemComponent implements OnInit {

  @Input()
  set ref(value: WsSaleRef) {
    this.refSource$.next(value);
  }

  refSource$ = new BehaviorSubject<WsSaleRef | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);
  sale$: Observable<WsSale>;

  constructor(
    private saleService: SaleService,
  ) {
  }

  ngOnInit() {
    this.sale$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsSaleRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    const loaded$ = this.saleService.getSale$(ref);
    return loaded$.pipe(
      delay(0),
      tap(() => this.loading$.next(false))
    );
  }
}
