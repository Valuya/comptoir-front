import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiService} from '../../../api.service';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {WsItem, WsItemRef} from '@valuya/comptoir-ws-api';

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

  private refSource$ = new BehaviorSubject<WsItemRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsItem>;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsItemRef) {
    this.loading$.next(true);
    const loaded$ = this.apiService.api.getItem({
      id: ref.id
    }) as any as Observable<WsItem>;
    return loaded$.pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}
