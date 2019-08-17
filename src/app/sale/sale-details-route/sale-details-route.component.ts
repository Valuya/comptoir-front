import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {WsItem, WsSale} from '@valuya/comptoir-ws-api';
import {Observable, of} from 'rxjs';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {AppMenuService} from '../../app-shell/app-menu.service';
import {ResolvedSaleDetailsMenuItem, SaleDetailMenuItems} from '../sale-menu';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-sales-details-route',
  templateUrl: './sale-details-route.component.html',
  styleUrls: ['./sale-details-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleDetailsRouteComponent implements OnInit {

  detailsRoutesItems$: Observable<MenuItem[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private menuService: AppMenuService,
  ) {

  }

  ngOnInit() {
    const routeSnapshot = this.activatedRoute.snapshot;
    const sale = RouteUtils.findRouteDataInRouteSnapshotAncestors<WsSale>(routeSnapshot.pathFromRoot, 'sale');
    this.detailsRoutesItems$ = of(this.createTabs(sale, routeSnapshot));
  }

  private createTabs(sale: WsSale, routeSnapshot: ActivatedRouteSnapshot) {
    const persisted = sale != null && sale.id != null;
    const routesItems = SaleDetailMenuItems
      .map(menuItem => this.menuService.cloneMenuItem(menuItem))
      .map(menuItem => this.menuService.updateMenuItemFromRouteSnapshot(menuItem, routeSnapshot));
    if (persisted) {
      return routesItems;
    } else {
      return [ResolvedSaleDetailsMenuItem];
    }
  }

}
