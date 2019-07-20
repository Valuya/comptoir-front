import {Injectable} from '@angular/core';
import {Configuration, DefaultApi, RequestArgs, RequestContext} from '@valuya/comptoir-ws-api';
import {AuthProvider} from './util/auth-provider';

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
          pre: (context: RequestContext) => this.onPreModdleware(context)
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
    const base64Token = btoa(auth.token);
    return `Bearer ${base64Token}`;
  }

  private onPreModdleware(context: RequestContext): RequestArgs {
    const token = this.getAccessToken();
    const curHeaders = context.options.headers as Record<string, string>;
    if (token != null) {
      curHeaders.authorization = token;
    }
    return context;
  }
}
