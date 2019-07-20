import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShellContentPageComponent} from './shell-content-page.component';
import {BreadcrumbModule} from 'primeng/primeng';
import {ContentHeaderActionsDirective} from './content-header-actions.directive';
import {ContentBodyDirective} from './content-body.directive';


@NgModule({
  declarations: [ShellContentPageComponent, ContentHeaderActionsDirective, ContentBodyDirective],
  imports: [
    CommonModule,
    BreadcrumbModule
  ],
  exports: [ShellContentPageComponent, ContentHeaderActionsDirective, ContentBodyDirective]
})
export class ShellContentPageModule {
}
