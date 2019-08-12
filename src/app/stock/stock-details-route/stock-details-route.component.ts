import {Component, OnInit} from '@angular/core';
import {WsStock} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {RouteUtils} from '../../util/route-utils';
import {ResolvedStockDetailsMenuItem, StockDetailMenuItems} from '../../stock/stock-menu';
import {AppMenuService} from '../../app-shell/app-menu.service';

@Component({
  selector: 'cp-stocks-details-route',
  templateUrl: './stock-details-route.component.html',
  styleUrls: ['./stock-details-route.component.scss'],

})
export class StockDetailsRouteComponent implements OnInit {

  detailsRoutesItems$: Observable<MenuItem[]>;


  constructor(
    private activatedRoute: ActivatedRoute,
    private menuService: AppMenuService,
  ) {
  }

  ngOnInit() {
    const routeSnapshot = this.activatedRoute.snapshot;
    const stock = RouteUtils.findRouteDataInRouteSnapshotAncestors<WsStock>(routeSnapshot.pathFromRoot, 'stock');
    this.detailsRoutesItems$ = of(this.createTabs(stock, routeSnapshot));
  }

  private createTabs(stock: WsStock, routeSnapshot: ActivatedRouteSnapshot) {
    const persisted = stock != null && stock.id != null;
    const routesItems = StockDetailMenuItems
      .map(menuItem => this.menuService.cloneMenuItem(menuItem))
      .map(menuItem => this.menuService.updateMenuItemFromRouteSnapshot(menuItem, routeSnapshot));
    if (persisted) {
      return routesItems;
    } else {
      return [ResolvedStockDetailsMenuItem];
    }
  }
}
