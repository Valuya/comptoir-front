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
    OnInit,
    OnChanges, SimpleChange
} from "angular2/core";
import {SearchRequest, SearchResult} from "../../../client/utils/search";
import {Customer} from "../../../domain/thirdparty/customer";
import {AuthService} from "../../../services/auth";
import {CustomerService} from "../../../services/customer";
import {Observable} from "rxjs/Observable";
import {FORM_DIRECTIVES, NgFor} from "angular2/common";
import {AutoFocusDirective} from "../../utils/autoFocus";
import {FocusableDirective} from "../../utils/focusable";
import {NewPagination} from "../../../client/utils/pagination";
import {WsCustomerSearch} from "../../../client/domain/search/customerSearch";

@Component({
    selector: 'customer-select',
    templateUrl: './components/customer/select/customerSelect.html',
    styleUrls: ['./components/customer/select/customerSelect.css'],
    directives: [NgFor, FORM_DIRECTIVES, AutoFocusDirective, FocusableDirective]
})
export class CustomerSelectComponent implements AfterViewInit, OnChanges {
    @Input()
    customerText:string;
    @Input()
    autoFocus:boolean = true;
    @Input()
    selectedCustomer:Customer;
    @Input()
    editable: boolean = true;
    @Input()
    emptyLabel: string = null;

    @Output()
    customerSelected = new EventEmitter();

    @ViewChild('customerInput')
    inputElement:ElementRef;
    @ViewChild('suggestionsDiv')
    suggestionsElement:ElementRef;

    private authService:AuthService;
    private customerService:CustomerService;
    private searchRequest:SearchRequest<Customer>;
    private searchResult:SearchResult<Customer>;
    private keyboardTimeout = 200;


    private focusedSuggestion:Customer;
    private suggestionsHidden:boolean;
    private handleFocusOut:boolean = true;

    constructor(authService:AuthService,
                customerService:CustomerService) {
        this.authService = authService;
        this.customerService = customerService;
        this.searchRequest = new SearchRequest<Customer>();
        var search = new WsCustomerSearch();
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

        this.searchResult = new SearchResult<Customer>();
    }


    ngOnChanges(changes:{
        [key:string]:SimpleChange;
    }) {
        if (changes['selectedCustomer'] == null) {
            return;
        }
        this.setSearchText();
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
            .do(()=> {
                this.suggestionsHidden = false;
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
        if (this.autoFocus) {
            this.focus();
        }
    }

    onFocus() {
        this.searchSuggestions(this.customerText);
    }

    onFocusOut(event) {
        if (!this.handleFocusOut) {
            return;
        }
        var target = <HTMLElement>event.relatedTarget;
        if (target != null && target.classList.contains('customer-suggestion')) {
            return;
        }
        this.suggestionsHidden = true;
        this.setSearchText();
        this.searchRequest.search.multiSearch = null;
    }

    onCustomerFocused(customer:Customer) {
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
            default:
            {
                return;
            }
        }
        event.stopPropagation();
    }

    public focus() {
        if (this.inputElement) {
            var inputelement = <HTMLInputElement>this.inputElement.nativeElement;
            this.doFocusViewElement(inputelement);

        }
    }

    private onCustomerSelected(customer:Customer) {
        this.focusedSuggestion = customer;
        this.selectedCustomer = customer;
        this.onSuggestionSelected();
    }

    private onSuggestionSelected() {
        this.setSearchText();
        this.customerSelected.emit(this.focusedSuggestion);
        this.suggestionsHidden = true;
    }

    private searchSuggestions(multiSearch:string) {
        if (multiSearch == this.searchRequest.search.multiSearch) {
            this.suggestionsHidden = false;
            return;
        }
        this.searchRequest.search.multiSearch = multiSearch;
        this.customerService.search(this.searchRequest)
            .then((result)=> {
                this.suggestionsHidden = false;
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
        this.customerText = "";
        if (this.selectedCustomer != null) {
            if (this.selectedCustomer.lastName != null) {
                this.customerText += this.selectedCustomer.lastName+" ";
            }
            if (this.selectedCustomer.firstName) {
                this.customerText += this.selectedCustomer.firstName;
            }
        }
    }
}