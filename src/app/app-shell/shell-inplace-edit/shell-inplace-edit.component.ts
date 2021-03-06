import {
  AfterViewInit, ChangeDetectionStrategy,
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
  ViewChild, ViewChildren
} from '@angular/core';
import {InplaceOutputDirective} from './inplace-output.directive';
import {InplaceInputDirective} from './inplace-input.directive';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {InplaceEditService} from './inplace-edit.service';
import {timer} from 'rxjs';
import {OverlayPanel} from 'primeng/primeng';
import {FocusFirstInputDirective} from '../focus-first-input.directive';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
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
  @Input()
  forceHoverEffect: boolean;
  @Input()
  showEmptyLabel: boolean;
  @Input()
  noAutoFocus: boolean;

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
  @ViewChildren(FocusFirstInputDirective)
  private focusInputDirectives: FocusFirstInputDirective[];


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
    this.focusFirstInput();
  }

  ngOnDestroy(): void {
    if (this.editService) {
      this.editService.unregister(this);
    }
  }

  ngAfterViewInit(): void {
    this.focusFirstInput();
  }


  startEdit(event: Event) {
    this.editing = true;
    this.editingChange.next(true);
    if (this.inputOverlay) {
      this.inputOverlay.show(event, this.outputElement.nativeElement);
    }

    this.editValue = this.value;
    this.focusFirstInput();
  }

  stopEdit() {
    this.editing = false;
    this.editingChange.next(false);
    if (this.inputOverlay) {
      this.inputOverlay.hide();
    }
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

  onNullifyClick() {
    this.fireChanges(null);
    this.stopEdit();
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
        if (this.inputTemplate != null) {
          this.startEdit(keyboardEvent);
        } else {
          this.commitEdit();
        }
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

  commitEdit(value?: any) {
    if (value !== undefined) {
      this.editValue = value;
    }
    this.fireChanges(this.editValue);
    this.stopEdit();
  }

  onOverlayHidden() {
    if (this.editing) {
      this.commitEdit();
    }
  }

  //
  // private focusFirstInput() {
  //   if (this.inputOverlay != null) {
  //     const overlayContainer = this.inputOverlay.container;
  //     this.focusFirstInputOfElement(overlayContainer);
  //   }
  //   // if (this.inputTemplate != null) {
  //   //   const element: HTMLElement = this.inputComponent.nativeElement;
  //   //   this.focusFirstInputOfElement(element);
  //   // }
  // }

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

  private focusFirstInput() {
    if (this.focusInputDirectives) {
      this.focusInputDirectives
        .forEach(d => d.focusFirstInput());
      timer(10).subscribe(() => {
      });
    }
  }

}
