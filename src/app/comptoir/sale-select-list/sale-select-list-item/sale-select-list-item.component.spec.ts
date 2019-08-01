import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSelectListItemComponent } from './sale-select-list-item.component';

describe('VariantSelectListItemComponent', () => {
  let component: SaleSelectListItemComponent;
  let fixture: ComponentFixture<SaleSelectListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleSelectListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleSelectListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
