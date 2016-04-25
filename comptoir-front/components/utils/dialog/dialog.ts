/**
 * Created by cghislai on 07/08/15.
 */
import {Component, EventEmitter, Attribute, Input, Output} from 'angular2/core';
import {NgIf} from 'angular2/common';

@Component({
    selector: 'comptoir-dialog',
    templateUrl: './components/utils/dialog/dialog.html',
    styleUrls: ['./components/utils/dialog/dialog.css'],
    directives: [NgIf]
})
export class DialogComponent {

    @Input()
    modal:boolean;
    @Input()
    closable:boolean;
    @Input()
    title:string;

    @Output()
    close = new EventEmitter();

    visible:boolean;

    constructor() {
        this.visible = true;
    }

    onContainerClick() {
        if (this.modal || !this.closable) {
            return;
        }
        this.doClose();
    }

    doClose() {
        this.visible = false;
        this.close.emit(null);
    }
}
