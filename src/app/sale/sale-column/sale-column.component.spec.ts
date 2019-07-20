import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleColumnComponent } from './sale-column.component';

describe('SaleColumnComponent', () => {
  let component: SaleColumnComponent;
  let fixture: ComponentFixture<SaleColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
