import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {WsCompany, WsCompanyRef, WsEmployee, WsRegistration} from '@valuya/comptoir-ws-api';
import {RegistrationModel} from './registration-model';
import {LoginService} from '../login.service';
import {MessageService} from 'primeng/api';
import {Router} from '@angular/router';

@Component({
  selector: 'cp-register-route',
  templateUrl: './register-route.component.html',
  styleUrls: ['./register-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterRouteComponent implements OnInit {

  loading$ = new BehaviorSubject<boolean>(false);

  registrationModel: RegistrationModel = this.createRegistration();

  constructor(
    private loginService: LoginService,
    private router: Router,
    private messageService: MessageService,
  ) {
  }

  ngOnInit() {
  }


  submit() {
    this.loading$.next(true);
    this.loginService.register(this.registrationModel)
      .subscribe(ref => this.onRegisterSuccess(ref),
        error => this.onRegistrationError(error));
  }


  private createRegistration(): RegistrationModel {
    return {
      company: {
        customerLoyaltyRate: 0,
        countryRef: null,
        description: [],
        id: null,
        name: []
      } as WsCompany,
      employee: {
        companyRef: null,
        login: null,
        locale: null,
        active: true,
        lastName: null,
        firstName: null,
        id: null
      } as WsEmployee,
      employeePassword: null
    };
  }

  private onRegisterSuccess(ref: WsCompanyRef) {
    this.messageService.add({
      severity: 'success',
      summary: 'Registered'
    });
    this.router.navigate(['/login']);
  }

  private onRegistrationError(error: any) {
    this.messageService.add({
      severity: 'error',
      summary: 'Registration failed',
      detail: error
    });
  }
}
