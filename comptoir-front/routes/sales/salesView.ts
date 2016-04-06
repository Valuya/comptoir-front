/**
 * Created by cghislai on 28/08/15.
 */

import {Component} from 'angular2/core';
import {RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {SaleView} from './sale/saleView';
import {ActiveSalesView} from './actives/listView';
import {SaleHistoryView} from './history/historyView';

import {AppHeaderComponent} from '../../components/app/header/appHeader';
import {AppMenuComponent} from '../../components/app/header/menu/appMenu';
import {AppTabComponent} from '../../components/app/header/tab/appTab';
import {SaleDetailsView} from "./details/detailsView";
import {ActiveSaleService} from "../../services/activeSale";

@Component({
    bindings: [ActiveSaleService],
    templateUrl: './routes/sales/salesView.html',
    directives: [AppHeaderComponent, AppMenuComponent, AppTabComponent, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/sale/:id', component: SaleView, as: 'Sale'},
    {path: '/details/:id', component: SaleDetailsView, as: 'Details'},
    {path: '/actives', component: ActiveSalesView, as: 'Actives', useAsDefault: true},
    {path: '/history', component: SaleHistoryView, as: 'History'}
])
export class SalesView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isActive(path: string) {
        var fullPath = path.replace('./', 'sales/');
        var locationPath = this.location.path();
        return locationPath.indexOf(fullPath) >= 0;
    }

}
