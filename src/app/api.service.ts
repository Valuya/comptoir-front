import {Inject, Injectable, Optional} from '@angular/core';
import {Configuration, DefaultApi, RequestArgs, RequestContext} from '@valuya/comptoir-ws-api';
import {AuthProvider} from './util/auth-provider';
import {HeaderUtils} from './util/header-utils';
import {BackendConfig, BackendConfigToken} from './util/backend-config';
import {RuntimeConfig, RuntimeConfigToken} from './util/runtime-config';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api: DefaultApi;
  private backendUrl: string;

  constructor(
    private authProvider: AuthProvider,
    @Inject(BackendConfigToken)
    private backendConfig: BackendConfig,
    @Inject(RuntimeConfigToken)
    private runtimeConfig: RuntimeConfig
  ) {
    let backendUrl = backendConfig.url;
    if (runtimeConfig != null && runtimeConfig.backend != null && runtimeConfig.backend.url != null) {
      backendUrl = runtimeConfig.backend.url;
    }
    this.backendUrl = backendUrl;

    this.api = new DefaultApi(new Configuration({
        basePath: backendUrl,
        accessToken: (name, scopes) => this.getAccessToken(name, scopes),
        middleware: [{
          pre: (context: RequestContext) => this.onPreMiddleware(context)
        }]
      })
    );
    console.log(`Api service using ${backendUrl}`);
  }

  getAccessTokenHeader(name?: string, scopes?: string[]) {
    if (this.authProvider == null) {
      return null;
    }
    const auth = this.authProvider.auth;
    if (auth == null) {
      return null;
    }
    return HeaderUtils.toBearerAuthHeader(this.getAccessToken());
  }

  getAccessTokenQueryParam() {
    if (this.authProvider == null) {
      return null;
    }
    const auth = this.authProvider.auth;
    if (auth == null) {
      return null;
    }
    const base64Token = btoa(this.getAccessToken());
    return base64Token;
  }

  getApiUrl(): string {
    return this.backendUrl + `/comptoir-ws`;
  }

  private getAccessToken(name?: string, scopes?: string[]): string {
    if (this.authProvider == null) {
      return null;
    }
    const auth = this.authProvider.auth;
    if (auth == null) {
      return null;
    }
    return auth.token;
  }

  private onPreMiddleware(context: RequestContext): RequestArgs {
    const token = this.getAccessTokenHeader();
    const curHeaders = context.options.headers as Record<string, string>;
    const existingAuthHeader = HeaderUtils.findHeaderIgnoreCase('authorization', curHeaders);
    if (existingAuthHeader == null) {
      curHeaders.authorization = token;
    }
    return context;
  }
}
