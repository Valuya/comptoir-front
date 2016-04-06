/**
 * Created by cghislai on 28/08/15.
 */
import {Component, Host} from "angular2/core";
import {NgForm, AbstractControl} from "angular2/common";
import {AuthService} from "../../../services/auth";

@Component({
    selector: 'form-message',
    inputs: ['controlPath: for', 'checkErrors', 'message', 'error', 'info'],
    templateUrl: './components/utils/formMessage/formMessage.html',
    styleUrls: ['./components/utils/formMessage/formMessage.css']
})
export class FormMessageComponent {
    static ERROR_MESSAGES = {
        'required': {
            'fr': 'Veuillez entrer une valeur',
            'en': 'Please enter a value'
        },
        'passwordTooShort': {
            'fr': 'Le mot de passe est trop court'
        }
    };

    controlPath:string;
    checkErrors:string;
    message:string;
    inlinePos:string = 'false';
    error:boolean = true;
    info:boolean = false;
    formDir:NgForm;
    formControl:AbstractControl;
    private authService:AuthService;


    constructor(@Host() formDir:NgForm,
                authService:AuthService) {
        this.formDir = formDir;
        this.authService = authService;
    }

    checkControl() {
        if (this.formControl == null) {
            this.formControl = this.formDir.form.find(this.controlPath);
        }
    }

    get control() {
        this.checkControl();
        return this.formControl;
    }

    get errorMessage() {
        if (this.checkErrors == null) {
            return this.message;
        }
        var errorsString = this.checkErrors.replace(/'/g, "\"");
        var errorArray = JSON.parse(errorsString);
        for (var i = 0; i < errorArray.length; ++i) {
            if (this.control.hasError(errorArray[i])) {
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

