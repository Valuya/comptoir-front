import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAndVariantSelectListComponent } from './item-and-variant-select-list.component';

describe('ItemAndVariantSelectListComponent', () => {
  let component: ItemAndVariantSelectListComponent;
  let fixture: ComponentFixture<ItemAndVariantSelectListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemAndVariantSelectListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAndVariantSelectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
