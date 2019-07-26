import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {WsItemVariant} from '@valuya/comptoir-ws-api';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ValidationResult} from '../../app-shell/shell-details-form/validation-result';
import {AttributeSelectItem} from '../../domain/commercial/attribute-value/attribute-select-item';
import {LocaleService} from '../../locale.service';
import {filter, publishReplay, refCount, switchMap, take, tap} from 'rxjs/operators';
import {BehaviorSubject, concat, Observable, of} from 'rxjs';
import {AttributeService} from '../../domain/commercial/attribute.service';

@Component({
  selector: 'cp-item-variant-form',
  templateUrl: './item-variant-form.component.html',
  styleUrls: ['./item-variant-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ItemVariantFormComponent,
      multi: true
    }
  ]
})
export class ItemVariantFormComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  validationResults: ValidationResult<WsItemVariant>;

  @Output()
  partialUpdate = new EventEmitter<Partial<WsItemVariant>>();
  @Output('attributesChange')
  editingAttributeSource$ = new BehaviorSubject<AttributeSelectItem[]>(null);

  value$ = new BehaviorSubject<WsItemVariant | null>(null);

  valueAttributesItems$: Observable<AttributeSelectItem[]>;

  get value() {
    return this.value$.getValue();
  }

  private onChange: (value: WsItemVariant) => void;
  private onTouched: () => void;


  constructor(private attributeService: AttributeService,
              private localeService: LocaleService) {
  }

  ngOnInit() {
    const attributeItemFromValue$ = this.value$.pipe(
      switchMap(value => this.fetchValueAttributes$(value)),
    );
    this.valueAttributesItems$ = attributeItemFromValue$.pipe(
      // load from value then editing updates
      switchMap(valueItems => concat(
        of(valueItems),
        this.editingAttributeSource$.pipe(filter(a => a != null)),
      )),
      publishReplay(1), refCount()
    );
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(obj: WsItemVariant): void {
    this.value$.next(obj);
  }


  updateAttributes(attributes: AttributeSelectItem[]) {
    this.editingAttributeSource$.next(attributes);
  }

  updateValue(update: Partial<WsItemVariant>) {
    this.partialUpdate.emit(update);
    const newValue = Object.assign({}, this.value, update);
    this.fireChanges(newValue);
  }

  private fireChanges(newValue: WsItemVariant) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }

  private fetchValueAttributes$(value: WsItemVariant): Observable<AttributeSelectItem[]> {
    if (value != null && value.attributeValueRefs != null) {
      return this.localeService.getViewLocale$().pipe(
        take(1),
        switchMap(locale => this.attributeService.createValueItems$(value.attributeValueRefs, locale))
      );
    } else {
      return of([]);
    }
  }
}
