import {Injectable} from '@angular/core';
import {SwPush} from '@angular/service-worker';
import {ApiService} from '../api.service';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {fromPromise} from 'rxjs/internal-compatibility';
import {switchMap} from 'rxjs/operators';
import {WebNotificationSubscriptionRequest} from '@valuya/comptoir-ws-api';

@Injectable({
  providedIn: 'root'
})
export class WebNotificationService {

  private messages$: Observable<{}>;
  private notificationsEnabled = true;

  constructor(
    private swPush: SwPush,
    private apiService: ApiService,
  ) {
    this.messages$ = this.swPush.messages;
  }


  subscribeToNotifications$(): Observable<any> {
    if (this.notificationsEnabled && this.swPush.isEnabled) {
      const serverPublicKeyValue = environment.backend.swPushKey;
      console.log('subscsribing to notification using key ' + serverPublicKeyValue);
      const subscriptionPromise$ = this.swPush.requestSubscription({
        serverPublicKey: serverPublicKeyValue,
      });
      return fromPromise(subscriptionPromise$).pipe(
        switchMap(subscription => this.register$(subscription))
      );
    } else {
      return throwError('Notifiations disabled');
    }
  }

  private register$(subscription: PushSubscription): Observable<any> {
    const subscriptionRequest = subscription.toJSON() as any as WebNotificationSubscriptionRequest;

    return this.apiService.api.subscriptionWebNotifications({
      webNotificationSubscriptionRequest: subscriptionRequest
    }) as any as Observable<any>;
  }
}
