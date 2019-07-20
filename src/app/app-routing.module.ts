import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeeLoggedInGuard} from './util/employee-logged-in.guard';
import {AppShellComponent} from './app-shell/app-shell.component';
import {APP_MODULES_ROUTES, APP_SHELL_ROUTE_DATA_ID} from './app-routes';


export const APP_BASE_ROUTES: Routes = [
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: '',
    canActivateChild: [EmployeeLoggedInGuard],
    children: [
      {
        path: '',
        component: AppShellComponent,
        data: {id: APP_SHELL_ROUTE_DATA_ID},
        children: APP_MODULES_ROUTES,
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(APP_BASE_ROUTES, {
    enableTracing: false,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
