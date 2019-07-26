import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShellDetailsFormComponent} from './shell-details-form.component';
import {ButtonModule} from 'primeng/button';
import {FormsModule} from '@angular/forms';
import {FormContentDirective} from './form-content.directive';


@NgModule({
  declarations: [ShellDetailsFormComponent, FormContentDirective],
  imports: [
    CommonModule,
    ButtonModule,
    FormsModule
  ],
  exports: [ShellDetailsFormComponent, FormContentDirective]
})
export class ShellDetailsFormModule {
}
