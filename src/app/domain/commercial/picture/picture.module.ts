import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PictureComponent} from './picture.component';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';


@NgModule({
  declarations: [PictureComponent],
  imports: [
    CommonModule,
    LoadingContentModule
  ],
  exports: [PictureComponent]
})
export class PictureModule { }
