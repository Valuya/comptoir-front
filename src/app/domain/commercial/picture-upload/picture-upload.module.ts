import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PictureUploadComponent } from './picture-upload.component';
import {PictureModule} from '../picture/picture.module';
import {ButtonModule} from 'primeng/button';
import {ProgressBarModule} from 'primeng/primeng';



@NgModule({
  declarations: [PictureUploadComponent],
  imports: [
    CommonModule,
    PictureModule,
    ButtonModule,
    ProgressBarModule
  ],
  exports: [PictureUploadComponent]
})
export class PictureUploadModule { }
