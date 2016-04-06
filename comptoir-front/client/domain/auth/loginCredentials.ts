/**
 * Created by cghislai on 02/04/16.
 */

export class WsLoginCredentials {
    login: string;
    passwordHash: string;
}

export class WsLoginCredentialsFactory {
    public static fromJSONReviver = (key, value)=>{
        return value;
    };
    public static toJSONReviver = (key, value)=>{
        return value;
    };
}