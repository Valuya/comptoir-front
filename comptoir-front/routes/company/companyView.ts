/**
 * Created by cghislai on 28/08/15.
 */

import {Component} from 'angular2/core';
import {RouteConfig,RouterOutlet,RouterLink, Location} from 'angular2/router';

import {AppHeaderComponent} from '../../components/app/header/appHeader';
import {AppTabComponent} from '../../components/app/header/tab/appTab';


import {EditCompanyView} from './edit/editView';

@Component({
    templateUrl: './routes/company/companyView.html',
    directives: [AppHeaderComponent, AppTabComponent, RouterOutlet, RouterLink]
})
@RouteConfig([
    {path: '/edit', component: EditCompanyView, as: 'Edit', useAsDefault: true}
])
export class CompanyView {
    location:Location;

    constructor(location:Location) {
        this.location = location;
    }

    isActive(path: string) {
        var fullPath = path.replace('./', 'company/');
        var locationPath = this.location.path();
        return locationPath.indexOf(fullPath) >= 0;
    }
}
