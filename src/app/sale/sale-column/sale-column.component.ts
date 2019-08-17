import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsSale} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import {SaleColumn} from './sale-columns';

@Component({
  selector: 'cp-sale-column',
  templateUrl: './sale-column.component.html',
  styleUrls: ['./sale-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleColumnComponent implements OnInit {

  @Input()
  row: WsSale;
  @Input()
  column: TableColumn<SaleColumn>;

  constructor() {
  }

  ngOnInit() {
  }

  discardEvent(event: MouseEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return false;
  }
}
