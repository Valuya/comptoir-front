/**
 * Created by cghislai on 31/07/15.
 */
/// <reference path="../../typings/_custom.d.ts" />
import {Component, View, ViewQuery, Query, QueryList} from 'angular2/angular2';
import {RouteConfig, RouterOutlet, RouterLink, routerInjectables} from 'angular2/router';

import {ApplicationService} from 'services/applicationService';
import {EditItemsView} from 'components/edit/editItemsView/editItemsView';

@Component({
    selector: "editView"
})
@View({
    templateUrl: "./components/edit/editView.html",
    styleUrls: ["./components/edit/editView.css"],
    directives: [RouterOutlet, RouterLink]
})


@RouteConfig([
    {path: '/', redirectTo: '/edit/items'},
    {path: '/items', component: EditItemsView, as: 'items'}
])

export class EditView {
    constructor(appService:ApplicationService) {
        appService.pageName = "Édition";
    }
}