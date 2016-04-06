/**
 * Created by cghislai on 28/08/15.
 */
import {Component, Host, Input, OnInit, AfterContentChecked} from "angular2/core";
import {NgForm, AbstractControl, FORM_DIRECTIVES} from "angular2/common";
import {AuthService} from "../../../services/auth";

@Component({
    selector: 'form-message',
    templateUrl: './components/utils/formMessage/formMessage.html',
    styleUrls: ['./components/utils/formMessage/formMessage.css'],
    directives: [FORM_DIRECTIVES]
})
export class FormMessageComponent implements AfterContentChecked {
    static ERROR_MESSAGES = {
        'required': {
            'fr': 'Veuillez entrer une valeur',
            'en': 'Please enter a value'
        },
        'passwordTooShort': {
            'fr': 'Le mot de passe est trop court'
        }
    };

    @Input("for")
    controlPath:string;
    @Input()
    checkErrors:string;
    @Input()
    message:string;
    @Input()
    error:boolean = true;
    @Input()
    info:boolean = false;

    formDir:NgForm;
    formControl:AbstractControl;

    private authService:AuthService;


    constructor(@Host() formDir:NgForm, authService:AuthService) {
        this.formDir = formDir;
        this.authService = authService;
        this.checkControl();
    }

    ngAfterContentChecked() {
        this.checkControl();
    }

    checkControl() {
        if (this.formControl == null) {
            this.formControl = this.formDir.form.find(this.controlPath);
        }
    }

    getControlErrorMessage() {
        if (this.formControl == null) {
            return null;
        }
        if (this.checkErrors == null) {
            return null;
        }
        var errorsString = this.checkErrors.replace(/'/g, "\"");
        var errorArray = JSON.parse(errorsString);
        for (var i = 0; i < errorArray.length; ++i) {
            if (this.formControl.hasError(errorArray[i])) {
                return this.getMessage(errorArray[i]);
            }
        }
        return null;
    }


    isPresent(c:AbstractControl) {
        if (c == null) {
            return false;
        }
        var value = c.value;
        return value = null && value.length > 0;
    }

    getMessage(error:string) {
        if (this.message != null) {
            return this.message;
        }
        var messages = FormMessageComponent.ERROR_MESSAGES[error];
        if (messages == null) {
            return null;
        }
        var language = this.authService.getEmployeeLanguage();
        return messages[language.locale];
    }
}

