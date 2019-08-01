import {InjectionToken} from '@angular/core';
import {BackendConfig} from './backend-config';
import {fromPromise} from 'rxjs/internal-compatibility';
import {Observable} from 'rxjs';

export const RuntimeConfigToken = new InjectionToken<RuntimeConfig>('comptoir.runtime.config');

export interface RuntimeConfig {
  backend: BackendConfig;
}

export function fetchRuntimeComptoirConfig$(): Observable<RuntimeConfig> {
  const responsePromise = fetch('/comptoir-runtime-config.json').then(
    response => {
      if (response.ok) {
        const body = response.body;
        const reader = body.getReader();
        return reader;
      } else {
        throw new Error('Invalid response');
      }
    }
  ).then(reader => {
    return readData(reader);
  }).then(bodyString => {
    try {
      return JSON.parse(bodyString) as RuntimeConfig;
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
  return fromPromise(responsePromise);
}

function readData(reader: ReadableStreamDefaultReader<Uint8Array>, previousData?: string) {
  const textDecoder = new TextDecoder();
  return reader.read().then(data => {
    const stringValue = textDecoder.decode(data.value);
    const newValue = previousData == null ? stringValue : previousData + stringValue;
    if (data.done) {
      return Promise.resolve(newValue);
    } else {
      return readData(reader, newValue);
    }
  });
}
