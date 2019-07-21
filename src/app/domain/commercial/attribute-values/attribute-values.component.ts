import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsAttributeValueRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, merge, Observable, of} from 'rxjs';
import {AttributeSelectItem} from '../attribute-value/attribute-select-item';
import {AttributeDefinitionSelectItem} from '../attribute-value/attribute-definition-select-item';
import {filter, mergeMap, publishReplay, refCount, switchMap, take, tap} from 'rxjs/operators';
import {LocaleService} from '../../../locale.service';
import {AttributesService} from '../attribute-value/attributes.service';

@Component({
  selector: 'cp-attribute-values',
  templateUrl: './attribute-values.component.html',
  styleUrls: ['./attribute-values.component.scss']
})
export class AttributeValuesComponent implements OnInit {

  @Input()
  set valueRefs(value: WsAttributeValueRef[]) {
    this.refsSource$.next(value);
  }

  @Input()
  set valueItems(value: AttributeDefinitionSelectItem[]) {
    this.itemsSource$.next(value);
  }

  @Input()
  showCloseAction = false;

  @Output()
  onItemCloseClicked = new EventEmitter<AttributeSelectItem>();

  refsSource$ = new BehaviorSubject<WsAttributeValueRef[]>(null);
  itemsSource$ = new BehaviorSubject<AttributeDefinitionSelectItem[]>(null);

  value$: Observable<AttributeSelectItem[]>;

  constructor(
    private localeService: LocaleService,
    private attributeService: AttributesService,
  ) {
  }

  ngOnInit() {

    const valueFromRefs$ = this.refsSource$.pipe(
      switchMap(ref => this.createItemFromRef$(ref)),
    );

    this.value$ = merge(valueFromRefs$, this.itemsSource$).pipe(
      filter(items => items != null),
      publishReplay(1), refCount()
    );
  }

  onItemCloseClick(item) {
    this.onItemCloseClicked.next(item);
  }

  private createItemFromRef$(refs: WsAttributeValueRef[]) {
    if (refs == null) {
      return of(null);
    }
    const locale$ = this.localeService.getViewLocale$().pipe(take(1));
    return locale$.pipe(
      mergeMap(locale => this.attributeService.createValueItems$(refs, locale))
    );
  }

}
