import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppShellComponent} from './app-shell.component';
import {BreadcrumbModule, ButtonModule, GrowlModule, PanelMenuModule} from 'primeng/primeng';
import {ToastModule} from 'primeng/toast';
import {LogoutRouteComponent} from './logout-route/logout-route.component';
import {DashboardRouteComponent} from './dashboard-route/dashboard-route.component';
import {ShellContentPageModule} from './shell-content-page/shell-content-page.module';
import {ClockComponent} from './clock/clock.component';
import {FocusFirstInputDirective} from './focus-first-input.directive';
import {ClickStopPropagationDirective} from './click-stop-propagation.directive';
import { ByPassSafeHtmlPipe } from './by-pass-safe-html.pipe';


@NgModule({
  declarations: [
    AppShellComponent,
    LogoutRouteComponent,
    DashboardRouteComponent,
    ClockComponent,
    FocusFirstInputDirective,
    ClickStopPropagationDirective,
    ByPassSafeHtmlPipe
  ],
  exports: [
    FocusFirstInputDirective,
    ClickStopPropagationDirective,
    ByPassSafeHtmlPipe
  ],
  imports: [
    CommonModule,
    PanelMenuModule,
    GrowlModule,
    ToastModule,
    BreadcrumbModule,
    ShellContentPageModule,
    ButtonModule
  ]
})
export class AppShellModule {
}
