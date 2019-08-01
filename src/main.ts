import {enableProdMode, StaticProvider, ValueProvider} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
import {fetchRuntimeComptoirConfig$, RuntimeConfigToken} from './app/util/runtime-config';
import {catchError, map, switchMap} from 'rxjs/operators';
import {forkJoin, Observable, of} from 'rxjs';
import {fromPromise} from 'rxjs/internal-compatibility';

if (environment.production) {
  enableProdMode();
}

const configTokenProvider$ = fetchRuntimeComptoirConfig$().pipe(
  map(config => {
    return {
      provide: RuntimeConfigToken,
      useValue: Object.assign({}, environment, config)
    } as ValueProvider;
  }),
  catchError(e => {
    console.warn('No runtime config provided: ' + e);
    return of({
      provide: RuntimeConfigToken,
      useValue: null
    } as ValueProvider);
  })
);

const provider$List: Observable<StaticProvider>[] = [configTokenProvider$];

forkJoin(provider$List).pipe(
  switchMap(providers => fromPromise(
    platformBrowserDynamic(providers)
      .bootstrapModule(AppModule)
  ))
).subscribe({
  error: err => console.error(err),
});


