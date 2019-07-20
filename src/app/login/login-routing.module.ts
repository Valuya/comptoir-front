import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginRouteComponent} from './login-route/login-route.component';


const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  component: LoginRouteComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule {
}
