import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShellContentPageComponent} from './shell-content-page.component';
import {ContentBodyDirective} from './content-body.directive';


@NgModule({
  declarations: [ShellContentPageComponent, ContentBodyDirective],
  imports: [
    CommonModule,
  ],
  exports: [ShellContentPageComponent, ContentBodyDirective]
})
export class ShellContentPageModule {
}
