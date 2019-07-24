import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  QueryList,
  TemplateRef
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
export class ShellInplaceEditComponent implements OnInit, OnDestroy, AfterContentInit, ControlValueAccessor {

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
  @ContentChildren('input', {
    descendants: true,
  })
  inputChildren: QueryList<HTMLInputElement>;

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

  ngAfterContentInit(): void {
  }

  onEditChange(edit: boolean) {
    this.editing = edit;
    this.editingChange.next(edit);
    if (edit) {
      this.editValue = this.value;
      this.focusFirstInput();
      if (this.editService) {
        this.editService.closeAllOthers(this);
      }
    }
  }

  onOutputClick() {
    this.onEditChange(true);
  }

  onCancelClick() {
    this.editValue = this.value;
    this.onEditChange(false);
  }

  onSubmitClick() {
    this.fireChanges(this.editValue);
    this.onEditChange(false);
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
    timer(20).subscribe(() => {
      if (this.inputChildren && this.inputChildren.length > 0) {
        this.inputChildren[0].nativeElement.focus();
      }
    });
  }

}
