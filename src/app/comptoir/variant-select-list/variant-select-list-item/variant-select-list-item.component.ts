import {Component, Input, OnInit} from '@angular/core';
import {WsItemVariant, WsItemVariantRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {ItemService} from '../../../domain/commercial/item.service';

@Component({
  selector: 'cp-variant-select-list-item',
  templateUrl: './variant-select-list-item.component.html',
  styleUrls: ['./variant-select-list-item.component.scss']
})
export class VariantSelectListItemComponent implements OnInit {

  @Input()
  set ref(value: WsItemVariantRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsItemVariantRef | null>(null);
  loading$ = new BehaviorSubject<boolean>(false);
  variant$: Observable<WsItemVariant>;

  constructor(
    private itemService: ItemService,
  ) {
  }

  ngOnInit() {
    this.variant$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsItemVariantRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    const loaded$ = this.itemService.getItemVariant$(ref);
    return loaded$.pipe(
      delay(0),
      tap(() => this.loading$.next(false))
    );
  }
}
