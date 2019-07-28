import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleAccountingEntriesListComponent } from './sale-accounting-entries-list.component';

describe('SaleAccountingEntriesListComponent', () => {
  let component: SaleAccountingEntriesListComponent;
  let fixture: ComponentFixture<SaleAccountingEntriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleAccountingEntriesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleAccountingEntriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
