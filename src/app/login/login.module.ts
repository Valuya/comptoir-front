import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginRoutingModule} from './login-routing.module';
import {LoginRouteComponent} from './login-route/login-route.component';
import {FormsModule} from '@angular/forms';
import {ButtonModule, CheckboxModule, InputTextModule} from 'primeng/primeng';
import { RegisterRouteComponent } from './register-route/register-route.component';
import {LocaleTextEditModule} from '../domain/lang/locale-text-edit/locale-text-edit.module';
import {CountrySelectModule} from '../domain/util/country-select/country-select.module';
import {LocaleSelectModule} from '../domain/lang/locale-select/locale-select.module';


@NgModule({
  declarations: [LoginRouteComponent, RegisterRouteComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
    LocaleTextEditModule,
    CountrySelectModule,
    LocaleSelectModule,
  ]
})
export class LoginModule {
}
