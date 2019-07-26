import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeeLoggedInGuard} from './util/employee-logged-in.guard';
import {AppShellComponent} from './app-shell/app-shell.component';
import {APP_MODULES_ROUTES} from './app-routes';
import {LoggedEmployeeResolverService} from './logged-employee-resolver.service';
import {LogoutRouteComponent} from './app-shell/logout-route/logout-route.component';


export const APP_BASE_ROUTES: Routes = [
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: 'logout',
    component: LogoutRouteComponent,
  },
  {
    path: '',
    canActivateChild: [EmployeeLoggedInGuard],
    resolve: {
      loggedEmployee: LoggedEmployeeResolverService
    },
    children: [
      {
        path: '',
        component: AppShellComponent,
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
