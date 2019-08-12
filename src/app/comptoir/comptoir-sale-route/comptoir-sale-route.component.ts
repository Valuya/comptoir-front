import {Component, OnDestroy, OnInit} from '@angular/core';
import {ComptoirSaleService} from '../comptoir-sale.service';
import {WsSale, WsSaleRef} from '@valuya/comptoir-ws-api';
import {combineLatest, concat, Observable, of, Subscription} from 'rxjs';
import {AuthService} from '../../auth.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, publishReplay, refCount, tap} from 'rxjs/operators';
import {ComptoirService} from '../comptoir-service';
import {MenuItem} from 'primeng/api';
import {ComptoirNewSaleRouteItem} from '../comptoir-menu';

@Component({
  selector: 'cp-comptoir-sale-route',
  templateUrl: './comptoir-sale-route.component.html',
  styleUrls: ['./comptoir-sale-route.component.scss'],
})
export class ComptoirSaleRouteComponent implements OnInit, OnDestroy {

  sale$: Observable<WsSale>;
  isFillRoute$: Observable<boolean>;
  isPayRoute$: Observable<boolean>;

  loading$: Observable<boolean>;

  openSales$: Observable<WsSaleRef[]>;
  openSalesMenuModel$: Observable<MenuItem[]>;

  constructor(
    private saleService: ComptoirSaleService,
    private comptoirService: ComptoirService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.sale$ = this.saleService.getSale$();
    const curChildUrl = this.activatedRoute.children[0].snapshot.url;
    const routeUrl$ = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.router.routerState.snapshot.url.split('/').map(a => {
        return {path: a};
      })),
      publishReplay(1), refCount()
    );
    this.isFillRoute$ = concat(
      of(curChildUrl),
      routeUrl$
    ).pipe(
      map(segements => segements.findIndex(s => s.path === 'fill') >= 0),
      publishReplay(1), refCount()
    );
    this.isPayRoute$ = concat(
      of(curChildUrl),
      routeUrl$
    ).pipe(
      map(segements => segements.findIndex(s => s.path === 'pay') >= 0),
      publishReplay(1), refCount()
    );

    this.openSales$ = this.saleService.getOpenSales$().pipe(
      map(r => r.list),
      publishReplay(1), refCount()
    );
    this.openSalesMenuModel$ = this.openSales$.pipe(
      map(refs => this.createOpenSaleMenu(refs)),
      publishReplay(1), refCount()
    );
  }

  ngOnDestroy(): void {
  }

  isSaleSelected(ref: WsSaleRef): boolean {
    const curSale = this.saleService.getActiveSaleOptional();
    return curSale == null ? ref == null : ref != null && curSale.id === ref.id;
  }

  getSaleHeader(ref: WsSaleRef) {
    return ref.id == null ? 'New Sale' : `Sale #${ref.id}`;
  }

  private createOpenSaleMenu(refs: WsSaleRef[]): MenuItem[] {
    const salesItems = refs.map(ref => {
      return {
        label: this.getSaleHeader(ref),
        routerLink: ['/comptoir/sale', ref.id]
      } as MenuItem;
    });
    return [
      ComptoirNewSaleRouteItem,
      ...salesItems
    ];
  }

}
