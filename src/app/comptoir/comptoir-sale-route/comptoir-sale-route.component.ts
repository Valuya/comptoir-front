import {Component, OnDestroy, OnInit} from '@angular/core';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {WsSale} from '@valuya/comptoir-ws-api';
import {concat, Observable, of, Subscription} from 'rxjs';
import {AuthService} from '../../auth.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, publishReplay, refCount, tap} from 'rxjs/operators';

@Component({
  selector: 'cp-comptoir-sale-route',
  templateUrl: './comptoir-sale-route.component.html',
  styleUrls: ['./comptoir-sale-route.component.scss'],
})
export class ComptoirSaleRouteComponent implements OnInit, OnDestroy {

  sale$: Observable<WsSale>;
  isFillRoute$: Observable<boolean>;
  isPayRoute$: Observable<boolean>;

  private serverEventSubscription: Subscription;

  constructor(
    private saleService: ComptoirSaleService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.sale$ = this.saleService.getSale$();
    const routeUrl$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.router.routerState.snapshot.url),
      publishReplay(1), refCount()
    );
    this.isFillRoute$ = concat(
      of(true),
      routeUrl$.pipe(map(segments => segments.indexOf('/fill') >= 0))
    ).pipe(
      publishReplay(1), refCount()
    );
    this.isPayRoute$ = concat(
      of(false),
      routeUrl$.pipe(map(segments => segments.indexOf('/pay') >= 0))
    ).pipe(
      publishReplay(1), refCount()
    );
    this.serverEventSubscription = this.saleService.subscribeToServerEvents$();
  }

  ngOnDestroy(): void {
    this.serverEventSubscription.unsubscribe();
  }
}
