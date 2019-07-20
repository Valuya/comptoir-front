import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AttributeDefinitionComponent} from './attribute-definition.component';
import {AppModule} from '../../../app.module';


@NgModule({
  declarations: [AttributeDefinitionComponent],
  exports: [AttributeDefinitionComponent],
  imports: [
    CommonModule,
    AppModule
  ]
})
export class AttributeDefinitionModule {
}
