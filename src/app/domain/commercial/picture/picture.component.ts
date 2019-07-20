import {Component, Input, OnInit} from '@angular/core';
import {WsPicture, WsPictureRef} from '@valuya/comptoir-ws-api';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ApiService} from '../../../api.service';
import {delay, map, publishReplay, refCount, switchMap, tap} from 'rxjs/operators';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {PictureUtils} from './picture-utils';

@Component({
  selector: 'cp-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss']
})
export class PictureComponent implements OnInit {

  @Input()
  set ref(value: WsPictureRef) {
    this.refSource$.next(value);
  }

  @Input()
  sizeType: 'small' | 'medium' | 'large' | 'custom' = 'small';

  private refSource$ = new BehaviorSubject<WsPictureRef>(null);

  loading$ = new BehaviorSubject<boolean>(false);
  value$: Observable<WsPicture>;
  safePictureCss$: Observable<SafeStyle>;

  constructor(private apiService: ApiService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.value$ = this.refSource$.pipe(
      delay(0),
      switchMap(ref => this.loadRef$(ref)),
      publishReplay(1), refCount()
    );
    this.safePictureCss$ = this.value$.pipe(
      map(pic => PictureUtils.toDataURI(pic)),
      map(val => val == null ? null : this.sanitizer.bypassSecurityTrustStyle(`background-image: url('${val}');`)),
      publishReplay(1), refCount()
    );
  }

  private loadRef$(ref: WsPictureRef) {
    if (ref == null) {
      return of(null);
    }
    this.loading$.next(true);
    const loaded$ = this.apiService.api.getPicture({
      id: ref.id
    }) as any as Observable<WsPicture>;
    return loaded$.pipe(
      delay(0),
      tap(def => this.loading$.next(false))
    );
  }
}
