import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemRoutingModule } from './item-routing.module';
import { ItemColumnComponent } from './item-column/item-column.component';
import { ItemFormComponent } from './item-form/item-form.component';
import { ItemListRouteComponent } from './item-list-route/item-list-route.component';
import { ItemDetailsRouteComponent } from './item-details-route/item-details-route.component';
import { ItemVariantListRouteComponent } from './item-variant-list-route/item-variant-list-route.component';
import { ItemVariantDetailsRouteComponent } from './item-variant-details-route/item-variant-details-route.component';
import { ItemVariantFormComponent } from './item-variant-form/item-variant-form.component';
import { ItemVariantColumnComponent } from './item-variant-column/item-variant-column.component';
import {ShellTableModule} from '../app-shell/shell-table/shell-table.module';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {ButtonModule} from 'primeng/button';
import {ShellDetailsFormModule} from '../app-shell/shell-details-form/shell-details-form.module';
import {FormsModule} from '@angular/forms';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {InputSwitchModule, InputTextModule, SpinnerModule} from 'primeng/primeng';
import {LocaleTextModule} from '../domain/lang/locale-text/locale-text.module';
import {LocaleTextEditModule} from '../domain/lang/locale-text-edit/locale-text-edit.module';
import {PictureModule} from '../domain/commercial/picture/picture.module';
import {PictureUploadModule} from '../domain/commercial/picture-upload/picture-upload.module';


@NgModule({
  declarations: [ItemColumnComponent, ItemFormComponent, ItemListRouteComponent, ItemDetailsRouteComponent, ItemVariantListRouteComponent, ItemVariantDetailsRouteComponent, ItemVariantFormComponent, ItemVariantColumnComponent],
  imports: [
    CommonModule,
    ItemRoutingModule,
    ShellTableModule,
    ShellContentPageModule,
    ButtonModule,
    ShellDetailsFormModule,
    FormsModule,
    ShellInplaceEditModule,
    InputSwitchModule,
    LocaleTextModule,
    LocaleTextEditModule,
    InputTextModule,
    SpinnerModule,
    PictureModule,
    PictureUploadModule
  ]
})
export class ItemModule { }
