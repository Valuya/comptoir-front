import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemVariantComponent} from './item-variant.component';

describe('ItemVariantComponent', () => {
  let component: ItemVariantComponent;
  let fixture: ComponentFixture<ItemVariantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemVariantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
