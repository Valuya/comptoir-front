import {Inject, Injectable} from '@angular/core';
import {Configuration, DefaultApi, RequestArgs, RequestContext} from '@valuya/comptoir-ws-api';
import {AuthProvider} from './util/auth-provider';
import {HeaderUtils} from './util/header-utils';
import {RuntimeConfigToken} from './util/runtime-config';
import {EnvironmentConfig, mergeConfigs} from '../environments/environment-config';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api: DefaultApi;
  private backendUrl: string;

  constructor(
    private authProvider: AuthProvider,
    @Inject(RuntimeConfigToken)
    private runtimeConfig: EnvironmentConfig
  ) {
    const config = mergeConfigs(environment, runtimeConfig);
    this.backendUrl = config.backend.url;

    this.api = new DefaultApi(new Configuration({
        basePath: this.backendUrl,
        accessToken: (name, scopes) => this.getAccessToken(name, scopes),
        middleware: [{
          pre: (context: RequestContext) => this.onPreMiddleware(context)
        }]
      })
    );
    console.log(`Api service using ${this.backendUrl}`);
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
