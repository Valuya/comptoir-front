import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsSaleRef} from '@valuya/comptoir-ws-api';
import {AuthService} from '../../../auth.service';
import {SaleService} from '../../../domain/commercial/sale.service';

@Component({
  selector: 'cp-active-sale-select',
  templateUrl: './active-sale-select.component.html',
  styleUrls: ['./active-sale-select.component.scss'],

})
export class ActiveSaleSelectComponent implements OnInit {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  @Output()
  saleSelected = new EventEmitter<WsSaleRef>();


  constructor(private saleService: SaleService,
              private authService: AuthService) {
  }

  ngOnInit() {
  }


  fireChanges(newValue: WsSaleRef) {
    this.saleSelected.next(newValue);
  }


}
