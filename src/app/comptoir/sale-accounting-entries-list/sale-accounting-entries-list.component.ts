import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsAccountingEntry} from '@valuya/comptoir-ws-api';

@Component({
  selector: 'cp-sale-accounting-entries-list',
  templateUrl: './sale-accounting-entries-list.component.html',
  styleUrls: ['./sale-accounting-entries-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleAccountingEntriesListComponent implements OnInit {

  @Input()
  entries: WsAccountingEntry[];
  @Output()
  entryRemoved = new EventEmitter<WsAccountingEntry>();

  constructor() {
  }

  ngOnInit() {
  }

  onRemoveClick(entry: WsAccountingEntry) {
    this.entryRemoved.next(entry);
  }
}
