import {Response} from "angular2/http";
import {Observable} from "rxjs/Observable";
/**
 * Created by cghislai on 02/04/16.
 */


export class ApplicationRequestCache {
    private static instance: ApplicationRequestCache;
    private requestList:Immutable.List<Observable<Response>> = Immutable.List([]);
    public busy:boolean;

    constructor() {
        ApplicationRequestCache.instance = this;
    }

    static getInstance() {
        if (ApplicationRequestCache.instance == null) {
            ApplicationRequestCache.instance = new ApplicationRequestCache();
        }
        return ApplicationRequestCache.instance;
    }

    static registerRequest(request:Observable<Response>) : Observable<Response>{
        var instance = ApplicationRequestCache.getInstance();

        instance.requestList = instance.requestList.push(request);
        instance.busy = true;
        return request.do(()=>{
            var index = instance.requestList.indexOf(request);
            instance.requestList = instance.requestList.remove(index);
            instance.busy = !instance.requestList.isEmpty();
        }, ()=>{
            var index = instance.requestList.indexOf(request);
            instance.requestList = instance.requestList.remove(index);
            instance.busy = !instance.requestList.isEmpty();
        });
    }

}