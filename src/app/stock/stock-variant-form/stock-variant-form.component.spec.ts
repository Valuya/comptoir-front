import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StockVariantFormComponent} from './stock-variant-form.component';

describe('StockVariantFormComponent', () => {
  let component: StockVariantFormComponent;
  let fixture: ComponentFixture<StockVariantFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockVariantFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockVariantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
