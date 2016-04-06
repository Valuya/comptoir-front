/**
 * Created by cghislai on 23/08/15.
 */

import {Directive, ElementRef, EventEmitter, OnInit, Input, Output} from 'angular2/core';


@Directive({
    selector: 'input[fast-input]',
    host: {
        '(keyup)': 'onKeyUp($event)',
        '(input)': 'onInput($event)',
        '(blur)': 'onBlur($event)',
        '(cancel)': 'doCancel()',
        '(validate)': 'doValidate()'
    }
})
export class FastInputDirective implements OnInit {
    static VALIDATE_EVENT = new Event('validate');
    static CANCEL_EVENT = new Event('cancel');
    elementRef:ElementRef;

    @Input()
    validator:(any)=>boolean;
    @Input()
    initialValue:any;
    @Input()
    validateOnBlur:boolean = false;

    @Output()
    fastChange = new EventEmitter();
    @Output()
    cancelled = new EventEmitter();

    validateRequired:boolean = false;

    constructor(elementRef:ElementRef) {
        this.elementRef = elementRef;
        this.initialValue = elementRef.nativeElement.value;

        var nativeElement = this.elementRef.nativeElement;
        nativeElement.doValidate = ()=> {
            nativeElement.dispatchEvent(FastInputDirective.VALIDATE_EVENT);
        };
        nativeElement.doCancel = ()=> {
            nativeElement.dispatchEvent(FastInputDirective.CANCEL_EVENT);
        };
    }

    ngOnInit() {
        if (this.initialValue != null) {
            this.elementRef.nativeElement.value = this.initialValue;
        }
        this.doFocus();
    }

    doFocus() {
        var element = this.elementRef.nativeElement;
        if (!this.validateOnBlur) {
            element.focus();
            setTimeout(function () {
                element.select();
                if (element.type === 'text') {
                    element.setSelectionRange(0, element.value.length);
                }
            }, 0);
        }
    }

    onKeyUp(event) {
        if (event.which === 13) { // Enter
            this.doValidate();
            return false;
        }
        if (event.which === 27) { // Escape
            this.doCancel();
            return false;
        }
        this.validateRequired = true;
        return false;
    }

    onInput(event) {
        var value = event.target.value;
        var valid = this.validate(value);
        return valid;
    }

    onBlur(event) {
        if (!this.validateOnBlur) {
            return true;
        }
        var value = event.target.value;
        var valid = this.validate(value);
        if (valid) {
            this.triggerChange(value);
        }
        return valid;
    }

    validate(value):boolean {
        if (!this.validateRequired) {
            return true;
        }
        this.validateRequired = false;
        if (value === this.elementRef.nativeElement.value) {
            return true;
        }
        if (this.validator == null) {
            return true;
        }
        var valid = this.validator(value);
        if (!valid) {
            this.elementRef.nativeElement.select();
        }
        return valid;
    }

    triggerChange(value) {
        this.fastChange.emit(value);
    }

    doValidate() {
        var value = this.elementRef.nativeElement.value;
        var valid = this.validate(value);
        if (valid) {
            this.triggerChange(value);
        }
    }

    doCancel() {
        this.elementRef.nativeElement.value = this.initialValue;
        this.cancelled.emit(null);
    }
}
