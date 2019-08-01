import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSelectGridItemComponent } from './sale-select-grid-item.component';

describe('VariantSelectGridItemComponent', () => {
  let component: SaleSelectGridItemComponent;
  let fixture: ComponentFixture<SaleSelectGridItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleSelectGridItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleSelectGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
