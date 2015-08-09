/**
 * Created by cghislai on 07/08/15.
 */

import {Component, View, formDirectives} from 'angular2/angular2';
import {Router, RouterLink} from 'angular2/router';
import {AuthService, LoginRequiredReason} from 'services/auth';
import {ApplicationService} from 'services/application';

@Component({
    selector: "loginView"
})
@View({
    templateUrl: './components/auth/login/login.html',
    styleUrls: ['./components/auth/login/login.css'],
    directives: [formDirectives, RouterLink]
})
export class LoginView {
    authService:AuthService;
    appService:ApplicationService;
    router: Router;
    login:string;
    password:string;

    error:boolean;
    errorReason:string;

    introText:string;

    constructor(authService:AuthService, appService:ApplicationService, router:Router) {
        this.authService = authService;
        this.appService = appService;
        this.router = router;
        this.checkLoginReason();
    }

    onSubmit() {
        var thisView = this;
        this.authService.login(this.login, this.password)
            .then(function (employee) {
                thisView.router.navigate('/sales/sale');
            }).catch(function (error) {
                thisView.appService.showError(error);
            });
    }

    checkLoginReason() {
        var reason = this.authService.loginRequiredReason;
        if (reason == undefined) {
            this.introText = "Bienvenue dans " + this.appService.appName +'.';
            this.introText += " Veuillez vous identifier pour continuer.";
            return;
        }
        switch (reason) {
            case LoginRequiredReason.NO_SESSION:
            {
                this.introText = "Vous devez vous identifier pour pouvoir utiliser ";
                this.introText += this.appService.appName+'.';
                break;
            }
            case LoginRequiredReason.SESSION_EXPIRED:
            {
                this.introText = "Votre session a expiré. Veuillez vous identifier à nouveau."
                break;
            }
        }
    }
}