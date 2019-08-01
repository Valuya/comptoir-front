import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSelectListComponent } from './sale-select-list.component';

describe('VariantSelectListComponent', () => {
  let component: SaleSelectListComponent;
  let fixture: ComponentFixture<SaleSelectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleSelectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
