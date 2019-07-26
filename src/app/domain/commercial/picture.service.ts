import {Injectable} from '@angular/core';
import {ApiService} from '../../api.service';
import {Observable} from 'rxjs';
import {Pagination} from '../../util/pagination';
import {CachedResourceClient} from '../util/cache/cached-resource-client';
import {WsPicture, WsPictureRef, WsPictureSearch, WsPictureSearchResult} from '@valuya/comptoir-ws-api';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PictureService {


  private pictureCache: CachedResourceClient<WsPictureRef, WsPicture>;

  constructor(
    private apiService: ApiService
  ) {
    this.pictureCache = new CachedResourceClient<WsPictureRef, WsPicture>(
      ref => this.doGet$(ref),
      val => this.doPut$(val),
      val => this.doCreate$(val),
      // ref => this.doDelete$(ref),
    );
  }

  savePicture(picture: WsPicture): Observable<WsPicture> {
    if (picture.id == null) {
      return this.pictureCache.createResource$(picture);
    } else {
      return this.pictureCache.updateResource$(picture);
    }
  }

  getPicture$(ref: WsPictureRef): Observable<WsPicture> {
    return this.pictureCache.getResource$(ref);
  }

  searchPictureList$(seachFilter: WsPictureSearch, pagination: Pagination): Observable<WsPictureSearchResult> {
    return this.apiService.api.searchPictures({
      offset: pagination.first,
      length: pagination.rows,
      wsPictureSearch: seachFilter
    }) as any as Observable<WsPictureSearchResult>;
  }

  private doGet$(ref: WsPictureRef) {
    return this.apiService.api.getPicture({
      id: ref.id
    }) as any as Observable<WsPicture>;
  }


  private doPut$(val: WsPicture) {
    return this.apiService.api.updatePicture({
      id: val.id,
      wsPicture: val
    }) as any as Observable<WsPictureRef>;
  }

  private doCreate$(val: WsPicture) {
    return this.apiService.api.createPicture({
      wsPicture: val
    }) as any as Observable<WsPictureRef>;
  }

  // private doDelete$(ref: WsPictureRef) {
  //   return this.apiService.api.remo({
  //     id: ref.id
  //   }) as any as Observable<WsPictureRef>;
  // }
//
}
