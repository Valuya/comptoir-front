import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {WsCustomerRef, WsPicture, WsPictureRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, EMPTY, forkJoin, Observable, Observer, Subscriber, Subscription} from 'rxjs';
import {MessageService} from 'primeng/api';
import {PictureUtils} from '../picture/picture-utils';
import {catchError, delay, map, mergeMap, take, tap} from 'rxjs/operators';
import {AuthService} from '../../../auth.service';
import {ApiService} from '../../../api.service';

@Component({
  selector: 'cp-picture-upload',
  templateUrl: './picture-upload.component.html',
  styleUrls: ['./picture-upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: PictureUploadComponent,
    multi: true,
  }]
})
export class PictureUploadComponent implements OnInit, ControlValueAccessor {

  @Input()
  disabled = false;
  @Input()
  previewSize = 200;
  @Input()
  maxSizeKb = 3072; // 3mo

  @ViewChild('fileInput', {static: true})
  private fileInput: ElementRef;

  valueSource$ = new BehaviorSubject<WsPictureRef | null>(null);

  uploading$ = new BehaviorSubject<boolean>(false);
  progressValue: number;
  progressPercentage: number;

  private uploadSubscription: Subscription;

  private onChange: (value: WsCustomerRef) => void;
  private onTouched: () => void;

  constructor(private messageService: MessageService,
              private authService: AuthService,
              private apiService: ApiService) {
  }

  ngOnInit() {
  }

  onOpenClicked() {
    const inputElement: HTMLInputElement = this.fileInput.nativeElement;
    inputElement.value = null;
    inputElement.click();
    return false;
  }

  onRemoveClicked() {
    this.valueSource$.next(null);
    return false;
  }


  onFileChosen(event) {
    const files: File[] = event.target.files;
    if (files.length !== 1) {
      return;
    }
    const file = files[0];
    if (this.isFileTooLarge(file)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Image trop grosse',
        detail: `Choisissez une image de ${this.getSizeKbLabel(this.maxSizeKb)} maximum`
      });
      return;
    }
    this.uploadSubscription = this.createPictureFromFile$(file).pipe(
      mergeMap(wsPic => this.uploadPicture$(wsPic)),
    ).subscribe(pictureRef => {
        this.valueSource$.next(pictureRef);
        this.fireChanges(pictureRef);
      }, error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Impossible de lire le fichier',
          detail: `${error}`
        });
        this.valueSource$.next(null);
      },
    );
  }

  onCancelUploadClicked($event: MouseEvent) {
    if (this.uploadSubscription != null) {
      this.uploadSubscription.unsubscribe();
      this.uploadSubscription = null;
    }
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
    this.valueSource$.next(obj);
  }

  fireChanges(newValue: WsPicture) {
    if (this.onTouched) {
      this.onTouched();
    }
    if (this.onChange) {
      this.onChange(newValue);
    }
  }

  private createProgressObserver(): Subscriber<number> {
    this.progressPercentage = 0;
    return new Subscriber((percent: number) => {
      this.progressPercentage = this.toFixedDecimals(percent);
      this.progressValue = this.progressPercentage / 100;
    });
  }

  private isFileTooLarge(file: File): boolean {
    const size = file.size;
    const sizeKb = size / 1024;
    return sizeKb > this.maxSizeKb;
  }

  private getSizeKbLabel(size: number): string {
    if (size < 2048) {
      return `${this.toFixedDecimals(size)} ko`;
    }
    const sizeMb = size / 1024;
    if (sizeMb < 2048) {
      return `${this.toFixedDecimals(sizeMb)} mo`;
    }
    const sizeGb = size / 1024;
    return `${this.toFixedDecimals(sizeGb)} go`;
  }

  private toFixedDecimals(numberValue: number, decimals: number = 2) {
    if (numberValue == null) {
      return 0.0;
    }
    const fixedString = numberValue.toFixed(decimals);
    const periodIndex = fixedString.indexOf('.');
    const parsed = parseFloat(fixedString.substr(0, periodIndex + decimals + 1));
    if (isNaN(parsed)) {
      return 0.0;
    }
    return parsed;
  }

  private createPictureFromFile$(file: File): Observable<WsPicture> {
    const dataURI$ = this.readFileAsDataUri(file);
    const companyRef$ = this.authService.getLoggedEmployeeCompanyRef$().pipe(take(1));
    return forkJoin(dataURI$, companyRef$).pipe(
      map(results => {
        const picture: WsPicture = {
          companyRef: results[1]
        };
        PictureUtils.setPictureDatafromDataURI(results[0], picture);
        return picture;
      })
    );
  }


  private readFileAsDataUri(file: File): Observable<string> {
    const reader = new FileReader();
    const subscription = new Subscription(() => {
      try {
        if (reader != null && reader.readyState === 1 /* FIXME: use constant LOADING*/) {
          reader.abort();
        }
      } catch (e) {
        console.warn('Failed to unsubscribe from filereader');
        console.warn(e);
      }
    });

    return Observable.create((observer: Observer<string>) => {
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const resultString: string = reader.result;
          observer.next(resultString);
          observer.complete();
        } else {
          observer.error(`Unexpected return type: ` + reader.result);
        }
      };
      reader.readAsDataURL(file);
      return subscription;
    });
  }

  private uploadPicture$(picture: WsPicture): Observable<WsPictureRef> {
    const data = PictureUtils.dataFromString(picture.data as any);
    const dataLength = data.length;
    const progressObserver = this.createProgressObserver();
    const byteProgressObserver = this.createByteProgressObserver(dataLength, progressObserver);

    this.uploading$.next(true);
    const saved$ = this.apiService.api.createPicture({
      wsPicture: picture
    }) as any as Observable<WsPictureRef>;
    return saved$.pipe(
      delay(0),
      tap(() => this.uploading$.next(false)),
    );
  }


  private createByteProgressObserver(dataLength: number, percentageObserver: Subscriber<number>): Subscriber<ProgressEvent> {
    if (percentageObserver == null) {
      return null;
    }
    return new Subscriber(
      (progressEvent: ProgressEvent) => {
        let percent = 100 * progressEvent.loaded / progressEvent.total;
        percent = Math.min(100, percent);
        percentageObserver.next(percent);
      });
  }

}
