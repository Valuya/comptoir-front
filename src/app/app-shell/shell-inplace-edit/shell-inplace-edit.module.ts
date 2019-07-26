import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShellInplaceEditComponent} from './shell-inplace-edit.component';
import {InplaceOutputDirective} from './inplace-output.directive';
import {InplaceInputDirective} from './inplace-input.directive';
import {OverlayPanelModule} from 'primeng/primeng';


@NgModule({
  declarations: [ShellInplaceEditComponent, InplaceOutputDirective, InplaceInputDirective],
  imports: [
    CommonModule,
    OverlayPanelModule
  ],
  exports: [ShellInplaceEditComponent, InplaceOutputDirective, InplaceInputDirective]
})
export class ShellInplaceEditModule { }
