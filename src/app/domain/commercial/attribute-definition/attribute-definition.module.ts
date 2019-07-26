import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AttributeDefinitionComponent} from './attribute-definition.component';
import {LocaleTextModule} from '../../lang/locale-text/locale-text.module';
import {LoadingContentModule} from '../../util/loading-content/loading-content.module';


@NgModule({
  declarations: [AttributeDefinitionComponent],
  exports: [AttributeDefinitionComponent],
  imports: [
    CommonModule,
    LocaleTextModule,
    LoadingContentModule
  ]
})
export class AttributeDefinitionModule {
}
