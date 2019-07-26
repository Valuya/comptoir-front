import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {InplaceOutputDirective} from './inplace-output.directive';
import {InplaceInputDirective} from './inplace-input.directive';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {InplaceEditService} from './inplace-edit.service';
import {timer} from 'rxjs';
import {OverlayPanel} from 'primeng/primeng';

@Component({
  selector: 'cp-shell-inplace-edit',
  templateUrl: './shell-inplace-edit.component.html',
  styleUrls: ['./shell-inplace-edit.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ShellInplaceEditComponent,
      multi: true
    }
  ]
})
export class ShellInplaceEditComponent implements OnInit, OnDestroy, AfterViewInit, ControlValueAccessor {

  @Input()
  editing = false;
  @Input()
  errors: string[];
  @Input()
  validating: boolean;
  @Input()
  disabled: boolean;

  @Output()
  editingChange = new EventEmitter<boolean>();

  @ContentChild(InplaceOutputDirective, {static: false, read: TemplateRef})
  outputTemplate: TemplateRef<any>;
  @ContentChild(InplaceInputDirective, {static: false, read: TemplateRef})
  inputTemplate: TemplateRef<any>;

  @ViewChild('inputComponent', {static: false})
  private inputComponent: ElementRef;
  @ViewChild('inputOverlay', {static: false})
  private inputOverlay: OverlayPanel;
  @ViewChild('outputElement', {static: true})
  private outputElement: ElementRef;

  value: any;
  editValue: any;

  onChange: (value: any) => void;
  onTouched: () => void;

  constructor(@Inject(InplaceEditService) @Optional() private editService: InplaceEditService) {
  }

  ngOnInit() {
    if (this.editService) {
      this.editService.register(this);
    }
  }

  ngOnDestroy(): void {
    if (this.editService) {
      this.editService.unregister(this);
    }
  }

  ngAfterViewInit(): void {
  }


  startEdit(event: Event) {
    this.editing = true;
    this.editingChange.next(true);
    this.inputOverlay.show(event, this.outputElement.nativeElement);

    this.editValue = this.value;
    timer(10).subscribe(() => {
      this.focusFirstInput();
    });
  }

  stopEdit() {
    this.editing = false;
    this.editingChange.next(false);
    this.inputOverlay.hide();
  }

  onOutputClick(event: Event) {
    if (this.inputTemplate != null && !this.editing) {
      event.preventDefault();
      this.startEdit(event);
      return false;
    }
  }

  onCancelClick() {
    this.cancelEdit();
  }

  onInputFocusOut(event: FocusEvent) {
    if (!this.editing) {
      return;
    }
    const relatedTarget = event.relatedTarget;
    if (relatedTarget == null) {
      this.commitEdit();
      return false;
    }
    if (relatedTarget instanceof HTMLElement && this.inputComponent != null) {
      const inplaceInputComponent = this.inputComponent.nativeElement as HTMLElement;
      const inplaceInputContainer = inplaceInputComponent.parentElement;
      const posType: number = inplaceInputContainer.compareDocumentPosition(relatedTarget);
      // tslint:disable-next-line:no-bitwise
      if (posType & Node.DOCUMENT_POSITION_CONTAINED_BY) { // Contained by
        event.stopImmediatePropagation();
        return false;
      }
    }
    this.commitEdit();
  }


  onInputKeyDown(keyboardEvent: KeyboardEvent) {
    const keyCode = keyboardEvent.keyCode;
    switch (keyCode) {
      case 0x0D: // enter
        this.commitEdit();
        break;
      case 0x1B: // Escape
        this.cancelEdit();
        break;
      default:
        return;
    }
    keyboardEvent.preventDefault();
    return false;
  }

  onOutputKeyDown(keyboardEvent: KeyboardEvent) {
    const keyCode = keyboardEvent.keyCode;
    switch (keyCode) {
      case 0x0D: // enter
      case 0x20: // space
        this.startEdit(keyboardEvent);
        break;
      default:
        return;
    }
    keyboardEvent.preventDefault();
    return false;
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.editValue = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  cancelEdit() {
    this.editValue = this.value;
    this.stopEdit();
  }

  commitEdit() {
    this.fireChanges(this.editValue);
    this.stopEdit();
  }

  onOverlayHidden() {
    if (this.editing) {
      this.commitEdit();
    }
  }

  private focusFirstInput() {
    if (this.inputOverlay != null) {
      const overlayContainer = this.inputOverlay.container;
      this.focusFirstInputOfElement(overlayContainer);
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
        const valueLength = firstInput.value.length;
        firstInput.setSelectionRange(0, valueLength);
      });
    }
  }

  private fireChanges(value: any) {
    this.value = value;
    this.editValue = value;
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(value);
    }
  }

}
