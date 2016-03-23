/**
 * Created by cghislai on 23/03/16.
 */


import {Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnInit} from "angular2/core";
import {SearchRequest, SearchResult} from "../../../client/utils/search";
import {LocalCustomer} from "../../../client/localDomain/customer";
import {AuthService} from "../../../services/auth";
import {CustomerService} from "../../../services/customer";
import {CustomerSearch} from "../../../client/domain/customer";
import {Observable} from "rxjs/Observable";
import {FORM_DIRECTIVES, NgFor} from "angular2/common";
import {AutoFocusDirective} from "../../utils/autoFocus";
import {FocusableDirective} from "../../utils/focusable";
import {NewPagination} from "../../../client/utils/pagination";

@Component({
    selector: 'customer-select-input',
    templateUrl: './components/customer/select/customerSelectInput.html',
    styleUrls: ['./components/customer/select/customerSelectInput.css'],
    directives: [NgFor, FORM_DIRECTIVES, AutoFocusDirective, FocusableDirective]
})
export class CustomerSelectInputComponent implements AfterViewInit, OnInit {
    @Input()
    customerText:string;
    @Output()
    customerSelected = new EventEmitter();

    @ViewChild('customerInput')
    inputElement:ElementRef;
    @ViewChild('suggestionsDiv')
    suggestionsElement:ElementRef;

    private authService:AuthService;
    private customerService:CustomerService;
    private searchRequest:SearchRequest<LocalCustomer>;
    private searchResult:SearchResult<LocalCustomer>;
    private keyboardTimeout = 200;


    private focusedSuggestion:LocalCustomer;
    private hasSelectedCustomer: boolean;

    constructor(authService:AuthService,
                customerService:CustomerService) {
        this.authService = authService;
        this.customerService = customerService;
        this.searchRequest = new SearchRequest<LocalCustomer>();
        var search = new CustomerSearch();
        search.companyRef = authService.getEmployeeCompanyRef();
        this.searchRequest.search = search;
        var pagination = NewPagination({
            firstIndex: 0,
            pageSize: 10,
            sorts: {
                'LAST_NAME': 'asc'
            }
        });
        this.searchRequest.pagination = pagination;

        this.searchResult = new SearchResult<LocalCustomer>();
    }

    ngOnInit() {
        if (this.customerText == null) {
            this.customerText = "";
        }
        this.searchSuggestions(this.customerText);
    }

    ngAfterViewInit() {
        if (this.inputElement == null) {
            console.error('Invalid field');
            return;
        }
       // triggers search for characters
        Observable.fromEvent(this.inputElement.nativeElement, 'keyup')
            .map((event:KeyboardEvent) => {
                var target = <HTMLInputElement>event.target;
                return target.value;
            })
            .distinctUntilChanged()
            .do(()=>{
                this.hasSelectedCustomer = false;
            })
            .debounceTime(this.keyboardTimeout)
            .subscribe((value:string)=> {
                this.searchSuggestions(value);
            });
        // Handle navigation
        Observable.fromEvent(this.inputElement.nativeElement, 'keyup')
            .subscribe((event:KeyboardEvent)=> {
                this.handleInputNavigationKeyUp(event);
            });
        this.focus();
    }

    onCustomerFocused(customer:LocalCustomer) {
        this.focusedSuggestion = customer;
    }

    onSuggestionsKeyUp(event) {
        switch (event.which) {
            case 13:
            {
                // Enter
                this.onSuggestionSelected();
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
            default: {
                return;
            }
        }
        event.stopPropagation();
    }

    public focus() {
        if (this.inputElement) {
            var inputelement = <HTMLInputElement>this.inputElement.nativeElement;
            inputelement.focus();
        }
    }

    private onCustomerSelected(customer: LocalCustomer) {
        this.focusedSuggestion = customer;
        this.onSuggestionSelected();
    }

    private onSuggestionSelected() {
        this.customerText = this.focusedSuggestion.firstName + " " + this.focusedSuggestion.lastName;
        this.customerSelected.emit(this.focusedSuggestion);
        this.hasSelectedCustomer = true;
    }

    private searchSuggestions(multiSearch:string) {
        if (multiSearch == this.searchRequest.search.multiSearch) {
            return;
        }
        this.searchRequest.search.multiSearch = multiSearch;
        this.customerService.search(this.searchRequest)
            .then((result)=> {
                this.searchResult = result;
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
        firstElement.focus();
    }

    private selectPrevious(element:HTMLElement) {
        var previous = <HTMLElement>element.previousElementSibling;
        if (previous) {
            previous.focus();
        }
    }

    private selectNext(element:HTMLElement) {
        var next = <HTMLElement>element.nextElementSibling;
        if (next) {
            next.focus();
        }
    }

}