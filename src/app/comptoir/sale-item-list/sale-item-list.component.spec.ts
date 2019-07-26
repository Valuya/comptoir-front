import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleItemListComponent } from './sale-item-list.component';

describe('SaleItemListComponent', () => {
  let component: SaleItemListComponent;
  let fixture: ComponentFixture<SaleItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
