import {Component, ContentChild, EventEmitter, OnInit, Output, TemplateRef} from '@angular/core';
import {FormContentDirective} from './form-content.directive';
import {Location} from '@angular/common';
import {InplaceEditService} from '../shell-inplace-edit/inplace-edit.service';

@Component({
  selector: 'cp-shell-details-form',
  templateUrl: './shell-details-form.component.html',
  styleUrls: ['./shell-details-form.component.scss'],
  providers: [InplaceEditService]
})
export class ShellDetailsFormComponent implements OnInit {

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
