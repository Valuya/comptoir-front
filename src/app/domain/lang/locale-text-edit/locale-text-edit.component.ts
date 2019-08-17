import {ChangeDetectionStrategy, Component, ContentChild, Inject, Input, OnDestroy, OnInit, Optional, TemplateRef} from '@angular/core';
import {LocaleTextsEditService} from './locale-texts-edit.service';
import {LocaleService} from '../../../locale.service';
import {BehaviorSubject, combineLatest, Observable, Subscription} from 'rxjs';
import {LocalizedEditDirective} from './localized-edit.directive';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WsLocaleText} from '../locale-text/ws-locale-text';
import {distinctUntilChanged, withLatestFrom} from 'rxjs/operators';

@Component({
  selector: 'cp-locale-text-edit',
  templateUrl: './locale-text-edit.component.html',
  styleUrls: ['./locale-text-edit.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: LocaleTextEditComponent,
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocaleTextEditComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  invalid: boolean;

  @Input()
  set editingTextValue(value: string) {
    this.editingTextValue$.next(value);
  }

  get editingTextValue() {
    return this.editingTextValue$.getValue();
  }

  editingTextValue$ = new BehaviorSubject<string | null>(null);

  @ContentChild(LocalizedEditDirective, {static: false, read: TemplateRef})
  localizedEditTemplate: TemplateRef<any>;


  textsValue$ = new BehaviorSubject<WsLocaleText[]>([]);
  editLocale$: Observable<string>;

  private onChange: (value: WsLocaleText[]) => void;
  private onTouched: () => void;
  private subscription: Subscription;

  constructor(
    @Inject(LocaleTextsEditService) @Optional()
    private editService: LocaleTextsEditService,
    private localeService: LocaleService,
  ) {
  }

  ngOnInit() {
    this.editLocale$ = this.editService != null ? this.editService.getEditingLocale$() : this.localeService.viewLocale$;
    this.subscription = new Subscription();

    const editsSubscription = this.editingTextValue$.pipe(
      distinctUntilChanged(),
      withLatestFrom(this.editLocale$)
    )
      .subscribe(results => this.updateLocalizedText(results[0], results[1]));
    this.subscription.add(editsSubscription);

    const resetSubscription = combineLatest(this.textsValue$, this.editLocale$)
      .pipe(distinctUntilChanged())
      .subscribe(results => this.resetEditingValueOnNewLocaleTexts(results[0], results[1]));
    this.subscription.add(resetSubscription);

    const emitChangesSubscription = this.textsValue$.subscribe(texts => this.fireChanges(texts));
    this.subscription.add(emitChangesSubscription);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  writeValue(obj: any): void {
    this.textsValue$.next(obj);
  }

  fireChanges(value: WsLocaleText[]) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(value);
    }
  }

  onEditLocaleChange(locale: string) {
    this.editService.setEditingLocale(locale);
  }

  private updateLocalizedText(textValue: string, localeValue: string) {
    if (localeValue == null) {
      return;
    }
    const curTexts = this.textsValue$.getValue();
    const clonedTexts: WsLocaleText[] = curTexts == null ? [] : [...curTexts]
      .map(text => Object.assign({}, text));
    if (clonedTexts == null) {
      this.textsValue$.next([]);
    }
    let localeText = clonedTexts.find(value => value.locale === localeValue);
    if (localeText == null) {
      localeText = {
        locale: localeValue,
        text: textValue,
      } as WsLocaleText;
      this.textsValue$.next([...clonedTexts, localeText]);
    } else {
      localeText.text = textValue;
      this.textsValue$.next(clonedTexts);
    }
  }

  private resetEditingValueOnNewLocaleTexts(textsValue: WsLocaleText[], localeValue: string) {
    if (localeValue == null || textsValue == null || textsValue.length === 0) {
      this.editingTextValue$.next(null);
      return;
    }
    const localeText = textsValue.find(value => value.locale === localeValue);
    if (localeText == null) {
      this.editingTextValue$.next(null);
      return;
    }
    const curValue = this.editingTextValue$.getValue();
    const newValue = localeText.text;
    if (curValue !== newValue) {
      this.editingTextValue$.next(localeText.text);
    }
  }

}
