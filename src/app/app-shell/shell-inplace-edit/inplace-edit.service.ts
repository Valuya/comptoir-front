import {Injectable} from '@angular/core';
import {ShellInplaceEditComponent} from './shell-inplace-edit.component';

@Injectable({
  providedIn: 'root'
})
export class InplaceEditService {

  components: ShellInplaceEditComponent[] = [];

  constructor() {
  }

  register(component: ShellInplaceEditComponent) {
    this.components = [...this.components, component];
  }

  unregister(component: ShellInplaceEditComponent) {
    this.components = this.components.filter(c => c !== component);
  }

  closeAllOthers(component: ShellInplaceEditComponent) {
    this.components.filter(c => c !== component)
      .filter(c => c.editing)
      .forEach(c => c.onCancelClick());
  }

  closeAll(component: ShellInplaceEditComponent) {
    this.components
      .filter(c => c.editing)
      .forEach(c => c.onCancelClick());
  }
}
