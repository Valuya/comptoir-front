import {Component, OnDestroy, OnInit} from '@angular/core';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {WsSale} from '@valuya/comptoir-ws-api';
import {Observable, Subscription} from 'rxjs';
import {AuthService} from '../../auth.service';

@Component({
  selector: 'cp-comptoir-sale-route',
  templateUrl: './comptoir-sale-route.component.html',
  styleUrls: ['./comptoir-sale-route.component.scss'],
})
export class ComptoirSaleRouteComponent implements OnInit, OnDestroy {

  sale$: Observable<WsSale>;
  private serverEventSubscription: Subscription;

  constructor(
    private saleService: ComptoirSaleService,
  ) {
  }

  ngOnInit() {
    this.sale$ = this.saleService.getSale$();

    this.serverEventSubscription = this.saleService.subscribeToServerEvents$();
  }

  ngOnDestroy(): void {
    this.serverEventSubscription.unsubscribe();
  }
}
