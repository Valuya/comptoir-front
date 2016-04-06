/**
 * Created by cghislai on 23/03/16.
 */


import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef,
    AfterViewInit,
    OnChanges,
    SimpleChange,
    Host,
    AfterContentChecked
} from "angular2/core";
import {SearchRequest, SearchResult} from "../../../client/utils/search";
import {AuthService} from "../../../services/auth";
import {FORM_DIRECTIVES, NgFor, NgForm, AbstractControl} from "angular2/common";
import {AutoFocusDirective} from "../../utils/autoFocus";
import {FocusableDirective} from "../../utils/focusable";
import {NewPagination} from "../../../client/utils/pagination";
import {WsAttributeDefinitionSearch} from "../../../client/domain/search/attributeDefinitionSearch";
import {AttributeDefinitionService} from "../../../services/attributeDefinition";
import {AttributeDefinition} from "../../../domain/commercial/attributeDefinition";
import {Language} from "../../../client/utils/lang";

@Component({
    selector: 'attribute-definition-suggestions',
    templateUrl: './components/attributeDefinition/suggestions/attributeDefinitionSuggestions.html',
    styleUrls: ['./components/attributeDefinition/suggestions/attributeDefinitionSuggestions.css'],
    directives: [NgFor, FORM_DIRECTIVES, AutoFocusDirective, FocusableDirective]
})
export class AttributeDefinitionSuggestionsComponent implements  AfterContentChecked, OnChanges {
    @Input("for")
    controlPath:string;
    @Input()
    selectedDefinition:AttributeDefinition;
    @Input()
    forceSelection:boolean = false;
    @Input()
    language:Language;

    @Output()
    definitionSelected = new EventEmitter();

    @ViewChild('suggestionsDiv')
    suggestionsElement:ElementRef;

    private authService:AuthService;
    private definitionService:AttributeDefinitionService;
    private searchRequest:SearchRequest<AttributeDefinition>;
    private searchResult:SearchResult<AttributeDefinition>;
    private keyboardTimeout = 200;

    private     formControl:AbstractControl;
    private ngFormDirective:NgForm;
    private focusedSuggestion:AttributeDefinition;
    private suggestionsHidden:boolean;
    private handleFocusOut:boolean = true;
    private handleInputChange:boolean = true;

    constructor(authService:AuthService,
                definitionService:AttributeDefinitionService,
                @Host() form:NgForm) {
        this.authService = authService;
        this.definitionService = definitionService;
        this.searchRequest = new SearchRequest<AttributeDefinition>();
        var search = new WsAttributeDefinitionSearch();
        search.companyRef = authService.getEmployeeCompanyRef();
        this.searchRequest.search = search;
        var pagination = NewPagination({
            firstIndex: 0,
            pageSize: 10,
            sorts: {
                'NAME': 'asc'
            }
        });
        this.searchRequest.pagination = pagination;

        this.searchResult = new SearchResult<AttributeDefinition>();
        this.ngFormDirective = form;
        this.checkControl();

    }

    checkControl() {
        if (this.formControl == null) {
            this.formControl = this.ngFormDirective.form.find(this.controlPath);
            if (this.formControl != null) {
                this.setupControlListener();
            }
        }
    }

    ngOnChanges(changes:{
        [key:string]:SimpleChange;
    }) {
        if (changes['selectedDefinition'] == null) {
            return;
        }
        this.setSearchText();
    }


    ngAfterContentChecked() {
        this.checkControl();
    }

    setupControlListener() {
        if (this.formControl == null) {
            console.error('Invalid form control');
            return;
        }
        // triggers search for characters
        this.formControl.valueChanges
            .filter(()=>{
                return this.handleInputChange;
            })
            .do(()=> {
                this.suggestionsHidden = false;
            })
            .debounceTime(this.keyboardTimeout)
            .subscribe((value:string)=> {
                this.searchSuggestions();
            });
        /* // Handle navigation
         Observable.fromEvent(this.inputElement.nativeElement, 'keyup')
         .subscribe((event:KeyboardEvent)=> {
         this.handleInputNavigationKeyUp(event);
         });*/
    }

    onFocus() {
        this.searchSuggestions();
    }

    onFocusOut(event) {
        if (!this.handleFocusOut) {
            return;
        }
        var target = <HTMLElement>event.relatedTarget;
        if (target != null && target.classList.contains('definition-suggestion')) {
            return;
        }
        this.suggestionsHidden = true;
        this.setSearchText();
        this.searchRequest.search.multiSearch = null;
    }

    onDefinitionFocused(definition:AttributeDefinition) {
        this.focusedSuggestion = definition;
    }

    onSuggestionsKeyUp(event) {
        switch (event.which) {
            case 13:
            {
                // Enter
                this.onSuggestionSelected();
                break;
            }
            case 27: {
                // Escape
                this.suggestionsHidden = true;
                break;
            }
            case 38:
            {
                // Up
                this.selectPrevious(event.target);
                break;
            }
            case 40:
            {
                // Down
                this.selectNext(event.target);
                break;
            }
            default:
            {
                return;
            }
        }
        event.stopPropagation();
    }

    private onSuggestionSelected() {
        this.setSearchText();
        this.definitionSelected.emit(this.focusedSuggestion);
        this.suggestionsHidden = true;
    }

    private searchSuggestions() {
        if (this.formControl == null) {
            return;
        }
        var nameSearch:string = this.formControl.value;
        if (nameSearch == this.searchRequest.search.multiSearch) {
            this.suggestionsHidden = false;
            return;
        }
        this.searchRequest.search.nameContains = nameSearch;
        this.searchRequest.search.locale = this.language.locale;
        this.definitionService.search(this.searchRequest)
            .then((result)=> {
                this.suggestionsHidden = false;
                this.searchResult = result;
                if (result.count == 0) {
                    this.selectedDefinition = null;
                    this.focusedSuggestion = null;
                    this.definitionSelected.emit(nameSearch);
                    this.suggestionsHidden = true;
                }
            });
    }

    private handleInputNavigationKeyUp(event:KeyboardEvent) {
        switch (event.which) {
            case 40:
            {
                // Down
                this.selectFirstSuggestion();
                break;
            }
        }
    }

    private selectFirstSuggestion() {
        if (this.suggestionsElement == null) {
            console.error('No suggestion element');
            return;
        }
        var divElement:HTMLElement = this.suggestionsElement.nativeElement;
        if (divElement.children.length < 1) {
            return;
        }
        var firstElement:HTMLElement = <HTMLElement>divElement.children.item(0);
        this.doFocusViewElement(firstElement);

    }

    private selectPrevious(element:HTMLElement) {
        var previous = <HTMLElement>element.previousElementSibling;
        if (previous) {
            this.doFocusViewElement(previous);

        }
    }

    private selectNext(element:HTMLElement) {
        var next = <HTMLElement>element.nextElementSibling;
        if (next) {
            this.doFocusViewElement(next);
        }
    }

    private doFocusViewElement(element:HTMLElement) {
        this.handleFocusOut = false;
        element.focus();
        this.handleFocusOut = true;
    }

    private setSearchText() {
        var definitionText = "";
        if (this.selectedDefinition != null) {
            if (this.selectedDefinition.name != null) {
                definitionText += this.selectedDefinition.name[this.language.locale];
            }
        }
        this.handleInputChange = false;
        if (this.formControl != null) {
            this.formControl.value = definitionText;
            this.formControl.updateValueAndValidity({
                onlySelf: false,
                emitEvent: false
            });
        }
        this.handleInputChange = true;
    }
}