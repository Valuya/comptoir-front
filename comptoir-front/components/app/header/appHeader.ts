/**
 * Created by cghislai on 28/08/15.
 */
import {Component} from 'angular2/core';
import {AppMenu} from './menu/appMenu';
import {ApplicationRequestCache} from "../../../client/utils/applicationRequestCache";

@Component({
    selector: 'app-header',
    inputs: ['title', 'inactive'],
    templateUrl: './components/app/header/appHeader.html',
    styleUrls: ['./components/app/header/appHeader.css'],
    directives: [AppMenu]
})
export class AppHeader {

    title:string;
    inactive: boolean;
    requestCache: ApplicationRequestCache;
    
    constructor() {
        this.requestCache = ApplicationRequestCache.getInstance();
    }

}
