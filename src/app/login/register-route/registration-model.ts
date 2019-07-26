import {WsCompany, WsEmployee, WsRegistration} from '@valuya/comptoir-ws-api';

export interface RegistrationModel extends WsRegistration {
  company: WsCompany;
  employee: WsEmployee;
}
