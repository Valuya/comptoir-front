/**
 * Created by cghislai on 02/08/15.
 */

import {Component, View, Attribute, EventEmitter, NgFor, Observable} from 'angular2/angular2';
import {Pagination} from 'client/utils/pagination';
import {SearchResult} from 'client/utils/search';

@Component({
    selector: 'paginator',
    events: ['pageChange'],
    properties: ['totalCountParam: totalCount', 'pageSizeParam: pageSize',
        "showPrevNextLink", 'showFirstLastLink']
})
@View({
    templateUrl: './components/utils/paginator/paginator.html',
    styleUrls: ['./components/utils/paginator/paginator.css'],
    directives: [NgFor]
})

export class Paginator {
    pageCount:number;
    pageSize: number;
    totalCount: number;

    showPrevNextLink:boolean;
    showFirstLastLink:boolean;
    pages:number[];
    activePage:number;
    maxPageLinks:number = 10;
    pageChange:EventEmitter;

    constructor() {
        this.activePage = 0;
        this.pageChange = new EventEmitter();
        this.buildPagesLinksArray();
    }

    buildPagesLinksArray() {
        if (this.totalCount == null) {
            return;
        }
        this.pages = [];
        this.pageCount = Math.ceil(this.totalCount / this.pageSize);
        console.log('build array with page count as ' + this.pageCount);

        var pageLinkShown = 0;
        var firstIndex = this.activePage - this.maxPageLinks / 2;
        firstIndex = Math.max(firstIndex, 0);
        var lastIndex = firstIndex + this.maxPageLinks;
        lastIndex = Math.min(lastIndex, this.pageCount - 1);
        for (var pageIndex = firstIndex; pageIndex <= lastIndex; pageIndex++) {
            this.pages.push(pageIndex);
        }
    }

    set totalCountParam(value:string) {
        this.totalCount = parseInt(value);
        this.buildPagesLinksArray();
    }
    set pageSizeParam(value:string) {
        this.pageSize = parseInt(value);
        this.buildPagesLinksArray();
    }
    goToFirst() {
        if (this.activePage <= 0) {
            return;
        }
        this.goToPage(0);
    }

    goToLast() {
        if (this.activePage >= this.pageCount - 1) {
            return;
        }
        this.goToPage(this.pageCount - 1);
    }

    goToPrev() {
        if (this.activePage == 0) {
            return;
        }
        this.goToPage(this.activePage - 1);
    }

    goToNext() {
        if (this.activePage >= this.pageCount - 1) {
            return;
        }
        this.goToPage(this.activePage + 1);
    }

    hasPrev() {
        return this.activePage > 0;
    }

    hasNext() {
        return this.activePage < this.pageCount - 1;
    }

    goToPage(pageIndex:number) {
        this.activePage = pageIndex;
        var pagination = new Pagination();
        pagination.pageIndex = pageIndex;
        var firstIndex = pageIndex * this.pageSize;
        var pageSize = Math.min(this.pageSize, this.totalCount- firstIndex);
        pagination.firstIndex = firstIndex;
        pagination.pageSize = pageSize;
        this.buildPagesLinksArray();

        this.pageChange.next(pagination);
    }

}