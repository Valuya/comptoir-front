/**
 * Created by cghislai on 28/08/15.
 */

import {Component} from 'angular2/core';
import {RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeaderComponent} from '../../components/app/header/appHeader';
import {AppMenuComponent} from '../../components/app/header/menu/appMenu';
import {AppTabComponent} from '../../components/app/header/tab/appTab';

import {AccountsListView} from './list/listView';
import {AccountsEditView} from './edit/editView';

@Component({
    templateUrl: './routes/accounts/accountsView.html',
    directives: [AppHeaderComponent, AppMenuComponent, AppTabComponent, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/edit/:id', component: AccountsEditView, as: 'Edit'},
    {path: '/list', component: AccountsListView, as: 'List', useAsDefault: true}
])
export class AccountsView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isActive(path: string) {
        var fullPath = path.replace('./', 'accounts/');
        var locationPath = this.location.path();
        return locationPath.indexOf(fullPath) >= 0;
    }
}
