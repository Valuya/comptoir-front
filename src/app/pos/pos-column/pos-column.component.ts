import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {WsPos} from '@valuya/comptoir-ws-api';
import {TableColumn} from '../../util/table-column';
import {PosColumn} from './pos-columns';

@Component({
  selector: 'cp-pos-column',
  templateUrl: './pos-column.component.html',
  styleUrls: ['./pos-column.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PosColumnComponent implements OnInit {

  @Input()
  row: WsPos;
  @Input()
  column: TableColumn<PosColumn>;

  constructor() {
  }

  ngOnInit() {
  }

}
