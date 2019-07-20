import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AttributeValueComponent} from './attribute-value.component';
import {AttributeDefinitionModule} from '../attribute-definition/attribute-definition.module';
import {AppModule} from '../../../app.module';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';
import {LocaleTextModule} from '../../lang/locale-text/locale-text.module';


@NgModule({
  declarations: [AttributeValueComponent],
  imports: [
    CommonModule,
    AttributeDefinitionModule,
    AppModule,
    LoadingContentModule,
    LocaleTextModule
  ],
  exports: [AttributeValueComponent]
})
export class AttributeValueModule { }
