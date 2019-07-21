import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppShellComponent} from './app-shell.component';
import {GrowlModule, PanelMenuModule} from 'primeng/primeng';
import {ToastModule} from 'primeng/toast';
import {LogoutRouteComponent} from './logout-route/logout-route.component';
import { DashboardRouteComponent } from './dashboard-route/dashboard-route.component';
import {ShellContentPageModule} from './shell-content-page/shell-content-page.module';


@NgModule({
  declarations: [
    AppShellComponent,
    LogoutRouteComponent,
    DashboardRouteComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    PanelMenuModule,
    GrowlModule,
    ToastModule,
    ShellContentPageModule
  ]
})
export class AppShellModule {
}
