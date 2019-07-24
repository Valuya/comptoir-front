import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ApiService} from '../../../api.service';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {WsItem, WsItemRef} from '@valuya/comptoir-ws-api';
import {ItemService} from '../item.service';

@Component({
  selector: 'cp-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  @Input()
  set ref(value: WsItemRef) {
    this.refSource$.next(value);
  }
  @Input()
  showMainPicture: boolean;
  @Input()
  showName: boolean;
  @Input()
  showDescription: boolean;
  @Input()
  showReference: boolean;

  private refSource$ = new BehaviorSubject<WsItemRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsItem>;

  constructor(private itemService: ItemService) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsItemRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    return this.itemService.getItem$(ref).pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}
