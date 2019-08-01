import {Inject, Injectable} from '@angular/core';
import {SwPush} from '@angular/service-worker';
import {ApiService} from '../api.service';
import {Observable, of, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {fromPromise} from 'rxjs/internal-compatibility';
import {switchMap, take} from 'rxjs/operators';
import {WebNotificationSubscriptionRequest} from '@valuya/comptoir-ws-api';
import {EnvironmentConfig, mergeConfigs} from '../../environments/environment-config';
import {RuntimeConfigToken} from '../util/runtime-config';

@Injectable({
  providedIn: 'root'
})
export class WebNotificationService {

  private messages$: Observable<{}>;
  private notificationsEnabled = true;

  constructor(
    private swPush: SwPush,
    private apiService: ApiService,
    @Inject(RuntimeConfigToken)
    private runtimeConfig: EnvironmentConfig,
  ) {
    this.messages$ = this.swPush.messages;
  }


  subscribeToNotifications$(): Observable<any> {
    if (this.notificationsEnabled && this.swPush.isEnabled) {
      return this.swPush.subscription.pipe(
        take(1),
        switchMap(subscription => this.unsubscribeIfRequired$(subscription)),
        switchMap(() => this.subscribe$()),
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

  private unsubscribeIfRequired$(subscription: PushSubscription) {
    if (subscription) {
      return fromPromise(subscription.unsubscribe());
    } else {
      return of(null);
    }
  }

  private subscribe$() {
    const config = mergeConfigs(environment, this.runtimeConfig);
    const publicKey = config.backend.swPushKey;
    const subscriptionPromise$ = this.swPush.requestSubscription({
      serverPublicKey: publicKey,
    });
    return fromPromise(subscriptionPromise$);
  }
}
