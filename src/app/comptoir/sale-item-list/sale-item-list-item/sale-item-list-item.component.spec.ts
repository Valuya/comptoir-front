import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleItemListItemComponent } from './sale-item-list-item.component';

describe('SaleItemListItemComponent', () => {
  let component: SaleItemListItemComponent;
  let fixture: ComponentFixture<SaleItemListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleItemListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleItemListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
