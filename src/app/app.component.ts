import {Component} from '@angular/core';

@Component({
  selector: 'cp-root',
  template: `
      <div class="messages">
          <p-toast position="top-center">
          </p-toast>
      </div>
      <router-outlet></router-outlet>`,
})
export class AppComponent {
}
