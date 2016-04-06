/**
 * Created by cghislai on 28/08/15.
 */
import {Component, Input} from 'angular2/core';
import {AppMenuComponent} from './menu/appMenu';
import {ApplicationRequestCache} from "../../../client/utils/applicationRequestCache";

@Component({
    selector: 'app-header',
    templateUrl: './components/app/header/appHeader.html',
    styleUrls: ['./components/app/header/appHeader.css'],
    directives: [AppMenuComponent]
})
export class AppHeaderComponent {

    @Input()
    title:string;
    @Input()
    inactive: boolean;

    requestCache: ApplicationRequestCache;
    
    constructor() {
        this.requestCache = ApplicationRequestCache.getInstance();
    }

}
