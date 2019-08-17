import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {WsItemVariant, WsItemVariantRef} from '@valuya/comptoir-ws-api';
import {ItemService} from '../item.service';

@Component({
  selector: 'cp-item-variant',
  templateUrl: './item-variant.component.html',
  styleUrls: ['./item-variant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemVariantComponent implements OnInit {

  @Input()
  set ref(value: WsItemVariantRef) {
    this.refSource$.next(value);
  }

  @Input()
  showMainPicture: boolean;
  @Input()
  showReference: boolean;
  @Input()
  showItemName: boolean;
  @Input()
  layout: 'row' | 'column' | 'details-column';

  private refSource$ = new BehaviorSubject<WsItemVariantRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsItemVariant>;

  constructor(private itemService: ItemService) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
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
    return this.itemService.getItemVariant$(ref).pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}
