import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot} from '@angular/router';
import {MenuItem} from 'primeng/api';
import {Observable, of} from 'rxjs';
import {WsItem} from '@valuya/comptoir-ws-api';
import {AppMenuService} from '../../app-shell/app-menu.service';
import {ItemDetailMenuItems, ResolvedItemDetailsMenuItem} from '../item-menu';
import {RouteUtils} from '../../util/route-utils';

@Component({
  selector: 'cp-item-details-route',
  templateUrl: './item-details-route.component.html',
  styleUrls: ['./item-details-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemDetailsRouteComponent implements OnInit {

  detailsRoutesItems$: Observable<MenuItem[]>;

  constructor(private activatedRoute: ActivatedRoute,
              private menuService: AppMenuService) {

  }

  ngOnInit() {
    const routeSnapshot = this.activatedRoute.snapshot;
    const item = RouteUtils.findRouteDataInRouteSnapshotAncestors<WsItem>(routeSnapshot.pathFromRoot, 'item');
    this.detailsRoutesItems$ = of(this.createTabs(item, routeSnapshot));
  }


  private createTabs(item: WsItem, routeSnapshot: ActivatedRouteSnapshot) {
    const persisted = item != null && item.id != null;
    const routesItems = ItemDetailMenuItems
      .map(menuItem => this.menuService.cloneMenuItem(menuItem))
      .map(menuItem => this.menuService.updateMenuItemFromRouteSnapshot(menuItem, routeSnapshot));
    if (persisted) {
      return routesItems;
    } else {
      return [ResolvedItemDetailsMenuItem];
    }
  }
}
