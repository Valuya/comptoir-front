import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShellTableComponent} from './shell-table.component';
import {TableModule} from 'primeng/table';
import {ShellColumnDirective} from './shell-column.directive';
import {FilterContentDirective} from './filter-content.directive';
import {AppShellModule} from '../app-shell.module';


@NgModule({
  declarations: [ShellTableComponent, ShellColumnDirective, FilterContentDirective],
  imports: [
    CommonModule,
    TableModule,
    AppShellModule
  ],
  exports: [ShellTableComponent, ShellColumnDirective, FilterContentDirective]
})
export class ShellTableModule {
}
