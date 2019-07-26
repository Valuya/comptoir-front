import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginRouteComponent} from './login-route/login-route.component';
import {RegisterRouteComponent} from './register-route/register-route.component';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: LoginRouteComponent
  },
  {
    path: 'register',
    component: RegisterRouteComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
