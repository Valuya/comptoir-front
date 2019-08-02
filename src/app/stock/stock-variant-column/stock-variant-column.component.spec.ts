import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StockVariantColumnComponent} from './stock-variant-column.component';

describe('StockVariantColumnComponent', () => {
  let component: StockVariantColumnComponent;
  let fixture: ComponentFixture<StockVariantColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockVariantColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockVariantColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
