import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MessageService} from 'primeng/primeng';
import {AppShellModule} from './app-shell/app-shell.module';
import {ToastModule} from 'primeng/toast';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppShellModule,
    ToastModule,
  ],
  providers: [
    MessageService,
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
