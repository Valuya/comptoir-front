import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {WsAttributeValue, WsAttributeValueRef} from '@valuya/comptoir-ws-api';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {ApiService} from '../../../api.service';

@Component({
  selector: 'cp-attribute-value',
  templateUrl: './attribute-value.component.html',
  styleUrls: ['./attribute-value.component.scss']
})
export class AttributeValueComponent implements OnInit {
  @Input()
  set ref(value: WsAttributeValueRef) {
    this.refSource$.next(value);
  }

  private refSource$ = new BehaviorSubject<WsAttributeValueRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsAttributeValue>;

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsAttributeValueRef) {
    this.loading$.next(true);
    const loaded$ = this.apiService.api.getAttributeValue({
      id: ref.id
    }) as any as Observable<WsAttributeValue>;
    return loaded$.pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}
