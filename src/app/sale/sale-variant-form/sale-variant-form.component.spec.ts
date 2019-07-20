import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SaleVariantFormComponent} from './sale-variant-form.component';

describe('SaleVariantFormComponent', () => {
  let component: SaleVariantFormComponent;
  let fixture: ComponentFixture<SaleVariantFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleVariantFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleVariantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
