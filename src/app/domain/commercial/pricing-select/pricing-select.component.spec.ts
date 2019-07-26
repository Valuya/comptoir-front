import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PricingSelectComponent} from './pricing-select.component';

describe('PricingSelectComponent', () => {
  let component: PricingSelectComponent;
  let fixture: ComponentFixture<PricingSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
