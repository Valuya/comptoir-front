import {Injectable} from '@angular/core';
import {WsAuth} from '@valuya/comptoir-ws-api';

@Injectable({
  providedIn: 'root'
})
export class AuthProvider {

  auth: WsAuth | null;
}
