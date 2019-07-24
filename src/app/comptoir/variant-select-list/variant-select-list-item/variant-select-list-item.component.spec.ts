import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariantSelectListItemComponent } from './variant-select-list-item.component';

describe('VariantSelectListItemComponent', () => {
  let component: VariantSelectListItemComponent;
  let fixture: ComponentFixture<VariantSelectListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariantSelectListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariantSelectListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
