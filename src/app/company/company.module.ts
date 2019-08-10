import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {CompanyRoutingModule} from './company-routing.module';
import {ShellContentPageModule} from '../app-shell/shell-content-page/shell-content-page.module';
import {CompanyFormComponent} from './company-form/company-form.component';
import {CompanyDetailsRouteComponent} from './company-details-route/company-details-route.component';
import {ShellDetailsFormModule} from '../app-shell/shell-details-form/shell-details-form.module';
import {FormsModule} from '@angular/forms';
import {ShellInplaceEditModule} from '../app-shell/shell-inplace-edit/shell-inplace-edit.module';
import {LocaleTextModule} from '../domain/lang/locale-text/locale-text.module';
import {LocaleTextEditModule} from '../domain/lang/locale-text-edit/locale-text-edit.module';
import {InputTextModule} from 'primeng/inputtext';
import {CountrySelectModule} from '../domain/util/country-select/country-select.module';
import {CountryModule} from '../domain/util/country/country.module';
import {AppShellModule} from '../app-shell/app-shell.module';
import {PercentInputModule} from '../domain/util/percent-input/percent-input.module';


@NgModule({
  declarations: [
    CompanyFormComponent,
    CompanyDetailsRouteComponent
  ],
  imports: [
    CommonModule,
    CompanyRoutingModule,
    ShellContentPageModule,
    ShellDetailsFormModule,
    FormsModule,
    ShellInplaceEditModule,
    LocaleTextModule,
    LocaleTextEditModule,
    InputTextModule,
    CountrySelectModule,
    CountryModule,
    AppShellModule,
    PercentInputModule,


  ]
})
export class CompanyModule {
}
