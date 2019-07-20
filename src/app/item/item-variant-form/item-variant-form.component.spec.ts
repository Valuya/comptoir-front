import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemVariantFormComponent} from './item-variant-form.component';

describe('ItemVariantFormComponent', () => {
  let component: ItemVariantFormComponent;
  let fixture: ComponentFixture<ItemVariantFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemVariantFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVariantFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
