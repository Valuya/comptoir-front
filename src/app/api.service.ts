import {Injectable} from '@angular/core';
import {Configuration, DefaultApi, RequestArgs, RequestContext} from '@valuya/comptoir-ws-api';
import {AuthProvider} from './util/auth-provider';
import {HeaderUtils} from './util/header-utils';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  api: DefaultApi;


  constructor(private authProvider: AuthProvider) {
    this.api = new DefaultApi(new Configuration({
        basePath: 'https://comptoir.local:8443',
        accessToken: (name, scopes) => this.getAccessToken(name, scopes),
        middleware: [{
          pre: (context: RequestContext) => this.onPreMiddleware(context)
        }]
      })
    );
  }

  private getAccessToken(name?: string, scopes?: string[]) {
    if (this.authProvider == null) {
      return null;
    }
    const auth = this.authProvider.auth;
    if (auth == null) {
      return null;
    }
    return HeaderUtils.toBearerAuthHeader(auth.token);
  }

  private onPreMiddleware(context: RequestContext): RequestArgs {
    const token = this.getAccessToken();
    const curHeaders = context.options.headers as Record<string, string>;
    const existingAuthHeader = HeaderUtils.findHeaderIgnoreCase('authorization', curHeaders);
    if (existingAuthHeader == null) {
      curHeaders.authorization = token;
    }
    return context;
  }
}
