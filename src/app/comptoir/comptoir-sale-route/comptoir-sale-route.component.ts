import {Component, OnInit} from '@angular/core';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {WsSale} from '@valuya/comptoir-ws-api';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'cp-comptoir-sale-route',
  templateUrl: './comptoir-sale-route.component.html',
  styleUrls: ['./comptoir-sale-route.component.scss']
})
export class ComptoirSaleRouteComponent implements OnInit {

  sale$: Observable<WsSale>;

  constructor(
    private saleService: ComptoirSaleService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.sale$ = this.saleService.getSale$();


  }

}
