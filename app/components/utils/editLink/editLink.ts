/**
 * Created by cghislai on 28/08/15.
 */
import {Component, EventEmitter, Output, Input, ViewEncapsulation} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";

@Component({
    selector: 'edit-link',
    template: `<span class="edit-link-component"
                    [class.editing]="editing"
                    [class.editable]="editable">
                    <ng-content></ng-content>
                    <span class="edit-actions">
                        <i class="fa fa-check green"
                            [hidden]="!showConfirmAction"
                            title="Valider"
                            (click)="onConfirmAction($event)"></i>
                        <i class="fa fa-times red"
                           title="Annuler"
                           (click)="onCancelAction($event)"></i>
                        <i class="fa fa-minus red"
                           title="Supprimer"
                           [hidden]="!showRemoveAction"
                           (click)="onRemoveAction($event)"></i>
                    </span>
                </span>`,
    styleUrls: ['./components/utils/editLink/editLink.css'],
    host: {
        "(click)": "onEditAction($event)",
        "[class.editing]":"editing",
        "[class.editable]":"editable"
    },
    directives: [CORE_DIRECTIVES],
    encapsulation: ViewEncapsulation.None
})
export class EditLinkComponent {
    private editing:boolean;

    @Output()
    private editAction = new EventEmitter();
    @Output()
    private cancelAction = new EventEmitter();
    @Output()
    private confirmAction = new EventEmitter();
    @Output()
    private removeAction = new EventEmitter();

    @Input()
    private editable:boolean = true;
    @Input()
    private showConfirmAction = true;
    @Input()
    private showRemoveAction = false;

    constructor() {
    }

    onEditAction(event) {
        if (this.editing || !this.editable) {
            return;
        }
        this.editing = true;
        event.stopImmediatePropagation();
        this.editAction.emit(null);
        return false;
    }

    doCancel() {
        if (!this.editing) {
            return;
        }
        this.editing = false;
    }

    onCancelAction(event) {
        this.doCancel();
        event.stopImmediatePropagation();
        this.cancelAction.emit(null);
        return false;
    }

    onConfirmAction(event) {
        this.doCancel();

        this.confirmAction.emit(null);
        event.stopImmediatePropagation();
        return false;
    }

    onRemoveAction(event) {
        this.removeAction.emit(null);
        event.stopImmediatePropagation();
        return false;
    }
}

