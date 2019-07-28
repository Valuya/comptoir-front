import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShellInplaceEditComponent} from './shell-inplace-edit.component';
import {InplaceOutputDirective} from './inplace-output.directive';
import {InplaceInputDirective} from './inplace-input.directive';
import {OverlayPanelModule} from 'primeng/primeng';
import {AppShellModule} from '../app-shell.module';


@NgModule({
  declarations: [ShellInplaceEditComponent, InplaceOutputDirective, InplaceInputDirective],
  imports: [
    CommonModule,
    OverlayPanelModule,
    AppShellModule
  ],
  exports: [ShellInplaceEditComponent, InplaceOutputDirective, InplaceInputDirective]
})
export class ShellInplaceEditModule { }
