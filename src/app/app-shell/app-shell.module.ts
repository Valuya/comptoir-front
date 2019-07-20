import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AppShellComponent} from './app-shell.component';
import {PanelMenuModule} from 'primeng/primeng';


@NgModule({
  declarations: [
    AppShellComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    PanelMenuModule
  ]
})
export class AppShellModule {
}
