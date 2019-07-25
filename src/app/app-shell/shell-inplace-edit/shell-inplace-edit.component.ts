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

  private focusInCaptured: boolean;

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


  onEditChange(edit: boolean) {
    this.editing = edit;
    this.editingChange.next(edit);
    if (edit) {
      if (this.editService) {
        this.editService.closeAllOthers(this);
      }
      this.editValue = this.value;
      this.focusFirstInput();
    }
  }

  onOutputClick(event: Event) {
    event.preventDefault();
    this.onEditChange(true);
    return false;
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
        this.onEditChange(true);
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

  private focusFirstInput() {
    if (this.inputTemplate != null) {
      const element: HTMLElement = this.inputComponent.nativeElement;
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
  }

  private cancelEdit() {
    this.editValue = this.value;
    this.onEditChange(false);
  }

  private commitEdit() {
    this.fireChanges(this.editValue);
    this.onEditChange(false);
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
