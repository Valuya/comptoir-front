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
    const stock = RouteUtils.findRouteDataInAncestors<WsStock>(routeSnapshot.pathFromRoot, 'stock');
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

  //
  // formHelper: ShellFormHelper<WsStock>;
  //
  // private subscription: Subscription;
  //
  // constructor(private activatedRoute: ActivatedRoute,
  //             private messageService: MessageService,
  //             private navigationService: NavigationService,
  //             private stockService: StockService,
  // ) {
  //   this.formHelper = new ShellFormHelper<WsStock>(
  //     value => this.validate$(value),
  //     value => this.persist$(value),
  //   );
  // }
  //
  // ngOnInit() {
  //   this.subscription = this.activatedRoute.data.pipe(
  //     map(data => data.stock),
  //   ).subscribe(stock => this.formHelper.init(stock));
  // }
  //
  // ngOnDestroy(): void {
  //   this.subscription.unsubscribe();
  // }
  //
  // onFormSubmit() {
  //   this.formHelper.persist$().subscribe(
  //     updatedStock => this.onSaveSuccess(updatedStock),
  //     error => this.messageService.add({
  //       severity: 'error',
  //       summary: `Error while saving stock`,
  //       detail: `${error}`
  //     })
  //   );
  // }
  //
  // private onSaveSuccess(updatedStock) {
  //   this.messageService.add({
  //     severity: 'success',
  //     summary: `Stock ${updatedStock.id} saved`
  //   });
  //   this.navigationService.navigateBackWithRedirectCheck();
  // }
  //
  // private validate$(value: WsStock): Observable<ValidationResult<WsStock>> {
  //   return of(ValidationResultFactory.emptyResults<WsStock>());
  // }
  //
  // private persist$(value: WsStock): Observable<WsStock> {
  //   return this.stockService.saveStock(value).pipe(
  //     switchMap(ref => this.stockService.getStock$(ref))
  //   );
  // }
}
