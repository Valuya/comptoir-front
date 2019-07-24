import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantSelectGridItemComponent } from './variant-select-grid-item.component';

describe('VariantSelectGridItemComponent', () => {
  let component: VariantSelectGridItemComponent;
  let fixture: ComponentFixture<VariantSelectGridItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantSelectGridItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantSelectGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
