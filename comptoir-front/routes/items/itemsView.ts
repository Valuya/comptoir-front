/**
 * Created by cghislai on 28/08/15.
 */

import {Component} from 'angular2/core';
import {RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeaderComponent} from '../../components/app/header/appHeader';
import {AppTabComponent} from '../../components/app/header/tab/appTab';

import {EditItemRedirect} from './edit/editRedirect';
import {ItemsListView} from './list/listView';
import {ItemsImportView} from './import/importView';

@Component({
    templateUrl: './routes/items/itemsView.html',
    directives: [AppHeaderComponent, AppTabComponent, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/edit/...', component: EditItemRedirect, as: 'Edit'},
    {path: '/list', component: ItemsListView, as: 'List', useAsDefault: true},
    {path: '/import', component: ItemsImportView, as: 'Import'}
])
export class ItemsView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isActive(path: string) {
        var fullPath = path.replace('./', 'items/');
        var locationPath = this.location.path();
        return locationPath.indexOf(fullPath) >= 0;
    }
}
