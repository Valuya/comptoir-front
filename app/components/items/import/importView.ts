/**
 * Created by cghislai on 14/08/15.
 */
import {Component, View, NgIf, formDirectives} from 'angular2/angular2';
import {Router, RouterLink} from 'angular2/router';
import {Language, LocaleTexts} from 'client/utils/lang';

import {ApplicationService} from 'services/application';
import {FileUploadService} from 'services/fileUpload';


@Component({
    selector: 'importItems'
})
@View({
    templateUrl: './components/items/import/importView.html',
    styleUrls: ['./components/items/import/importView.css'],
    directives: [NgIf, formDirectives, RouterLink]
})
export class ImportProductView {
    applicationService:ApplicationService;
    router:Router;
    language:Language;
    fileUploadService:FileUploadService;

    toUploadFile:File;
    toUploadFileSizeLabel:string;
    toUploadData:ArrayBuffer;

    uploadInProgress:boolean;
    uploadPercentage:number;

    constructor(appService:ApplicationService, fileUplaodService:FileUploadService,
                router:Router) {
        this.router = router;
        this.applicationService = appService;
        this.fileUploadService = fileUplaodService;
        this.language = appService.language;

        this.toUploadFile = null;
        this.toUploadData = null;
        this.toUploadFileSizeLabel = null;
        this.uploadInProgress = false;
        this.uploadPercentage = 0;
    }


     onFileSelectClick(fileInput) {
        fileInput.click();
    }

    onFileSelected(form, event) {
        var files = event.target.files;
        if (files.length != 1) {
            return;
        }
        this.toUploadFile = files[0];
        var size = this.toUploadFile.size;

        this.toUploadFileSizeLabel = size + " bytes";
        // optional code for multiples approximation
        for (var aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"], nMultiple = 0, nApprox = size / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
            this.toUploadFileSizeLabel = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + size + " bytes)";
        }

        var reader = new FileReader();
        var thisView = this;
        reader.onload = function () {
            thisView.toUploadData = reader.result;
        };

        reader.readAsArrayBuffer(this.toUploadFile);
    }


    onSubmit() {
        var thisView = this;
        this.uploadInProgress = true;
        this.fileUploadService
            .uploadFile(this.toUploadData, "https://cghislai:8181/comptoir-ws/item/import",
            (percentage: number)=>{
                thisView.uploadPercentage = percentage;
            })
            .then(()=> {
                thisView.uploadInProgress = false;
                thisView.router.navigate('/items/list');
            });
    }

}