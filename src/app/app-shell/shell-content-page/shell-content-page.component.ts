import {Component, ContentChild, OnInit, TemplateRef} from '@angular/core';
import {ContentBodyDirective} from './content-body.directive';

@Component({
  selector: 'cp-shell-content-page',
  templateUrl: './shell-content-page.component.html',
  styleUrls: ['./shell-content-page.component.scss']
})
export class ShellContentPageComponent implements OnInit {


  @ContentChild(ContentBodyDirective, {static: false, read: TemplateRef})
  bodyTemplateRef: TemplateRef<any>;

  constructor() {
  }

  ngOnInit() {
  }

}
