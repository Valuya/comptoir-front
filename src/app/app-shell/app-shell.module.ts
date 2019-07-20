import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppShellComponent} from './app-shell.component';
import {GrowlModule, PanelMenuModule} from 'primeng/primeng';
import {ToastModule} from 'primeng/toast';


@NgModule({
  declarations: [
    AppShellComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    PanelMenuModule,
    GrowlModule,
    ToastModule
  ]
})
export class AppShellModule {
}
