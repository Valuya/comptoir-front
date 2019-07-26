import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSaleSelectComponent } from './active-sale-select.component';

describe('ActiveSaleSelectComponent', () => {
  let component: ActiveSaleSelectComponent;
  let fixture: ComponentFixture<ActiveSaleSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveSaleSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveSaleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
