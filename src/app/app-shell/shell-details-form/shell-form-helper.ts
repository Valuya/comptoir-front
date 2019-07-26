import {BehaviorSubject, concat, Observable, of, Subject} from 'rxjs';
import {map, publishReplay, refCount, scan, switchMap, take, tap, toArray, windowTime, withLatestFrom} from 'rxjs/operators';
import {ValidationResult} from './validation-result';
import {ValidationResultFactory} from './validation-result.factory';

export class ShellFormHelper<T> {

  initialValue$ = new BehaviorSubject<T | null>(null);

  private editUpdates$ = new Subject<Partial<T>>();
  editingValue$: Observable<T>;

  validationResults$: Observable<ValidationResult<T>>;
  validating$ = new BehaviorSubject<boolean>(false);
  valid$: Observable<boolean>;

  persisting$ = new BehaviorSubject<boolean>(false);

  private validateFn$: (value: T) => Observable<any>;
  private persistFn$: (value: T) => Observable<T>;

  constructor(
    validate$: (value: T) => Observable<any>,
    persist$: (value: T) => Observable<T>
  ) {
    this.validateFn$ = validate$;
    this.persistFn$ = persist$;

    this.editingValue$ = this.initialValue$.pipe(
      switchMap(initialValue => this.getEditedValues$(initialValue)),
      publishReplay(1), refCount()
    );

    const validationResults$ = this.editUpdates$.pipe(
      windowTime(500),
      switchMap(window => window.pipe(toArray())),
      withLatestFrom(this.initialValue$, this.editingValue$),
      switchMap(updates => this.validateUpdates$(updates[0], updates[1], updates[2])),
      publishReplay(1), refCount()
    );
    this.validationResults$ = concat(
      of(ValidationResultFactory.emptyResults()),
      validationResults$
    );
    this.valid$ = this.validationResults$.pipe(
      map(results => results.valid),
      publishReplay(1), refCount()
    );

  }

  init(value: T) {
    this.initialValue$.next(value);
  }


  reset() {
    const initialValue = this.initialValue$.getValue();
    this.initialValue$.next(initialValue);

  }

  update(update: Partial<T>) {
    this.editUpdates$.next(update);
  }

  persist$(): Observable<T> {
    return this.editingValue$.pipe(
      take(1),
      switchMap(value => this.persistValue$(value)),
      tap(updatedValue => this.init(updatedValue)),
    );
  }

  private cloneValue(value: T) {
    return Object.assign({}, value);
  }

  private applyUpdate(editedValue: T, updateElement: Partial<T>) {
    const newValue = Object.assign({}, editedValue, updateElement);
    return newValue;
  }

  private validateUpdates$(updates: Partial<T>[], initialValue: T, editedValue: T): Observable<ValidationResult<T>> {
    this.validating$.next(true);
    return this.validateFn$(editedValue).pipe(
      tap(() => this.validating$.next(false))
    );
  }

  private getEditedValues$(initialValue: T) {
    const firstvalue = this.cloneValue(initialValue);
    const nextValues = this.editUpdates$.pipe(
      scan((cur, next) => this.applyUpdate(cur, next), initialValue)
    );
    return concat(of(firstvalue), nextValues);
  }

  private persistValue$(value: T): Observable<T> {
    this.persisting$.next(true);
    return this.persistFn$(value).pipe(
      tap(() => this.persisting$.next(false))
    );
  }
}
