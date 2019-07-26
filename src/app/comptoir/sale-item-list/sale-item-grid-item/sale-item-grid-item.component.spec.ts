import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleItemGridItemComponent } from './sale-item-grid-item.component';

describe('SaleItemGridItemComponent', () => {
  let component: SaleItemGridItemComponent;
  let fixture: ComponentFixture<SaleItemGridItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleItemGridItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleItemGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
