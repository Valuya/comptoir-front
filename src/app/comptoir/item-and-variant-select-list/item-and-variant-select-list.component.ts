import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsItemRef, WsItemVariantRef} from '@valuya/comptoir-ws-api';
import {$e} from 'codelyzer/angular/styles/chars';
import {MessageService} from 'primeng/api';
import {BehaviorSubject, Observable} from 'rxjs';
import {debounceTime, publishReplay, refCount} from 'rxjs/operators';

@Component({
  selector: 'cp-item-and-variant-select-list',
  templateUrl: './item-and-variant-select-list.component.html',
  styleUrls: ['./item-and-variant-select-list.component.scss']
})
export class ItemAndVariantSelectListComponent implements OnInit {

  @Input()
  autoSelectSingleVariant = true;

  @Output()
  variantSelect$ = new EventEmitter<WsItemVariantRef>();

  displayMode: 'list' | 'grid' = 'list';
  selectionTypeSource$$ = new BehaviorSubject<'item' | 'variant'>('item');
  debouncedSelectionType$: Observable<'item' | 'variant'>;

  itemRef: WsItemRef | null;

  constructor(
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
    this.debouncedSelectionType$ = this.selectionTypeSource$$.pipe(
      debounceTime(300),
      publishReplay(1), refCount()
    );
  }

  onItemSelected(ref: WsItemRef) {
    this.itemRef = ref;
    this.selectionTypeSource$$.next('variant');
  }

  onVariantSelected(ref: WsItemVariantRef) {
    this.variantSelect$.next(ref);
    this.selectionTypeSource$$.next('item');
    this.itemRef = null;
  }

}
