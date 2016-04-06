/**
 * Created by cghislai on 28/08/15.
 */
import {Component, ViewEncapsulation, Input} from 'angular2/core';

@Component({
    selector: 'app-tab',
    templateUrl: './components/app/header/tab/appTab.html',
    styleUrls: ['./components/app/header/tab/appTab.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppTabComponent {
    @Input()
    active: boolean;
    @Input()
    selectable: boolean;
}
