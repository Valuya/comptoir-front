import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {timer} from 'rxjs';

@Directive({
  selector: '[cpFocusFirstInput]'
})
export class FocusFirstInputDirective implements OnInit {

  @Input('cpFocusFirstInput')
  private enabled = true;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.focusFirstInput();
  }

  focusFirstInput() {
    if (!this.enabled) {
      return;
    }
    if (this.elementRef != null) {
      this.focusFirstInputOfElement(this.elementRef.nativeElement);
    }
    // if (this.inputTemplate != null) {
    //   const element: HTMLElement = this.inputComponent.nativeElement;
    //   this.focusFirstInputOfElement(element);
    // }
  }

  private focusFirstInputOfElement(element: HTMLElement) {
    const inputElements = element.getElementsByTagName('input');
    if (inputElements.length > 0) {
      const firstInput: HTMLInputElement = inputElements.item(0);
      timer(10).subscribe(() => {
        firstInput.focus({
          preventScroll: true
        });
        if (firstInput.setSelectionRange) {
          const valueLength = firstInput.value.length;
          firstInput.setSelectionRange(0, valueLength);
        }
      });
    }
  }

}
