import {Directive, HostListener} from '@angular/core';

@Directive({
  selector: '[cpClickStopPropagation]'
})
export class ClickStopPropagationDirective {

  @HostListener('click', ['$event'])
  public onClick(event: any): void {
    event.stopPropagation();
  }


  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: any): void {
    event.stopPropagation();
  }
}
