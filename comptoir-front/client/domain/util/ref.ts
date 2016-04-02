/**
 * Created by cghislai on 02/04/16.
 */

export abstract class WsRef<T> {
    id:number;
    link:string;

    constructor(id?:number) {
        this.id = id;
    }
}