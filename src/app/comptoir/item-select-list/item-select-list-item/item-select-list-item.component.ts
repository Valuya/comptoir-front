import {Component, Input, OnInit} from '@angular/core';
import {WsItem, WsItemRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {ItemService} from '../../../domain/commercial/item.service';

@Component({
  selector: 'cp-item-select-list-item',
  templateUrl: './item-select-list-item.component.html',
  styleUrls: ['./item-select-list-item.component.scss']
})
export class ItemSelectListItemComponent implements OnInit {

  @Input()
  set ref(value: WsItemRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsItemRef | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);
  item$: Observable<WsItem>;
  itemTotal$: Observable<number>;

  constructor(
    private itemService: ItemService,
  ) {
  }

  ngOnInit() {
    this.item$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
    this.itemTotal$ = this.item$.pipe(
      map(item => item == null ? 0 : item.vatExclusive * (1 + item.vatRate)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsItemRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    const loaded$ = this.itemService.getItem$(ref);
    return loaded$.pipe(
      delay(0),
      tap(() => this.loading$.next(false))
    );
  }
}
