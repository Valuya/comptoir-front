import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemVariantColumnComponent} from './item-variant-column.component';

describe('ItemVariantColumnComponent', () => {
  let component: ItemVariantColumnComponent;
  let fixture: ComponentFixture<ItemVariantColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemVariantColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVariantColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
