import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LoginRoutingModule} from './login-routing.module';
import {LoginRouteComponent} from './login-route/login-route.component';
import {FormsModule} from '@angular/forms';
import {ButtonModule, CheckboxModule, InputTextModule} from 'primeng/primeng';


@NgModule({
  declarations: [LoginRouteComponent],
  imports: [
    CommonModule,
    LoginRoutingModule,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    ButtonModule,
  ]
})
export class LoginModule {
}
