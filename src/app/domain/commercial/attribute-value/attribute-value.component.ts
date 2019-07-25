import {Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {WsAttributeValue, WsAttributeValueRef} from '@valuya/comptoir-ws-api';
import {delay, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {AttributeService} from '../attribute.service';

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

  constructor(
    private attributeService: AttributeService
  ) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsAttributeValueRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    return this.attributeService.getAttributeValue$(ref).pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}
