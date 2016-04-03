/**
 * Created by cghislai on 28/08/15.
 */

import {Component} from "angular2/core";
import {FORM_DIRECTIVES} from "angular2/common";
import {Router, RouterLink} from "angular2/router";
import {AppHeader} from "../../components/app/header/appHeader";
import {FormMessage} from "../../components/utils/formMessage/formMessage";
import {RequiredValidator} from "../../components/utils/validators";
import {AuthService} from "../../services/auth";
import {ErrorService} from "../../services/error";
import {MD5} from "../../components/utils/md5";


@Component({
    selector: "login-view",
    templateUrl: './routes/login/loginView.html',
    styleUrls: ['./routes/login/loginView.css'],
    directives: [FORM_DIRECTIVES, RouterLink, AppHeader, FormMessage, RequiredValidator]
})
export class LoginView {
    authService:AuthService;
    errorService:ErrorService;
    router:Router;

    login:string;
    password:string;
    introText:string;

    busy:boolean;
    invalidCredentials:boolean;

    // TODO: RouteData for introText
    constructor(authService:AuthService,
                errorService:ErrorService,
                router:Router) {
        this.authService = authService;
        this.errorService = errorService;
        this.router = router;
    }


    doLogin(event) {
        var hashedPassword = MD5.encode(this.password);

        this.busy = true;
        this.invalidCredentials = false;
        this.authService.login(this.login, hashedPassword)
            .then((employee)=> {
                this.busy = false;
                this.router.navigate(['/Sales/Sale', {id: 'active'}]);
            })
            .catch((error) => {
                this.busy = false;
                if (error.code === 401) {
                    this.invalidCredentials = true;
                    return;
                } else if (error.code === 404) {
                    this.invalidCredentials = true;
                    return;
                }
                this.errorService.handleRequestError(error);
            });
    }
}
