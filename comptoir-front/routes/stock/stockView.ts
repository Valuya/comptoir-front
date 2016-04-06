/**
 * Created by cghislai on 28/08/15.
 */

import {Component} from 'angular2/core';
import {RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeaderComponent} from '../../components/app/header/appHeader';
import {AppTabComponent} from '../../components/app/header/tab/appTab';


import {StockListView} from './list/listView';
import {EditStockView} from './edit/editView';

@Component({
    selector: 'stock-view',
    templateUrl: './routes/stock/stockView.html',
    directives: [AppHeaderComponent, AppTabComponent, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/edit/:id', component: EditStockView, as: 'Edit'},
    {path: '/list', component: StockListView, as: 'List', useAsDefault: true}
])
export class StockView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isActive(path:string) {
        var fullPath = path.replace('./', 'stock/');
        var locationPath = this.location.path();
        return locationPath.indexOf(fullPath) >= 0;
    }
}
