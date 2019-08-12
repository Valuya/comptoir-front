import {Component, ContentChild, EventEmitter, Input, OnInit, Output, TemplateRef} from '@angular/core';
import {FormContentDirective} from './form-content.directive';
import {InplaceEditService} from '../shell-inplace-edit/inplace-edit.service';

@Component({
  selector: 'cp-shell-details-form',
  templateUrl: './shell-details-form.component.html',
  styleUrls: ['./shell-details-form.component.scss'],
  providers: [InplaceEditService]
})
export class ShellDetailsFormComponent implements OnInit {

  @Input()
  submitLabel = 'Save';
  @Input()
  submitDisabled: boolean;
  @Output()
  formSubmit = new EventEmitter<any>();

  @ContentChild(FormContentDirective, {static: false, read: TemplateRef})
  formContentTemplate: TemplateRef<any>;

  constructor() {
  }

  ngOnInit() {
  }

  onSubmit() {
    this.formSubmit.next(true);
  }
}
