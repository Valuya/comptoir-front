/**
 * Created by cghislai on 28/08/15.
 */

import {Component} from 'angular2/core';
import {RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeaderComponent} from '../../components/app/header/appHeader';
import {AppTabComponent} from '../../components/app/header/tab/appTab';


import {CustomerListView} from './list/listView';
import {EditCustomerView} from './edit/editView';

@Component({
    templateUrl: './routes/customer/customerView.html',
    directives: [AppHeaderComponent, AppTabComponent, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/edit/:id', component: EditCustomerView, as: 'Edit'},
    {path: '/list', component: CustomerListView, as: 'List', useAsDefault: true}
])
export class CustomerView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isActive(path: string) {
        var fullPath = path.replace('./', 'customer/');
        var locationPath = this.location.path();
        return locationPath.indexOf(fullPath) >= 0;
    }
}
