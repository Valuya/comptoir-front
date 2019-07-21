import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ApiService} from '../../../api.service';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {WsItemVariant, WsItemVariantRef} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-item-variant',
  templateUrl: './item-variant.component.html',
  styleUrls: ['./item-variant.component.scss']
})
export class ItemVariantComponent implements OnInit {

  @Input()
  set ref(value: WsItemVariantRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsItemVariantRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsItemVariant>;

  constructor(private apiService: ApiService) {
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
    const loaded$ = this.apiService.api.getItemVariant({
      id: ref.id
    }) as any as Observable<WsItemVariant>;
    return loaded$.pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}