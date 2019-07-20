import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'cp-locale-select',
  templateUrl: './locale-select.component.html',
  styleUrls: ['./locale-select.component.scss']
})
export class LocaleSelectComponent implements OnInit {
  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  constructor() { }

  ngOnInit() {
  }

}
