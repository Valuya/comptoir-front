import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSelectComponent } from './sale-select.component';

describe('SaleSelectComponent', () => {
  let component: SaleSelectComponent;
  let fixture: ComponentFixture<SaleSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
