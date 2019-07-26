import {InjectionToken} from '@angular/core';
import {environment} from '../../environments/environment';

export const BackendConfigToken = new InjectionToken<BackendConfig>('comptoir.backend.config', {
  providedIn: 'root',
  factory: () => environment.backend
});

export interface BackendConfig {
  url: string;
}
