import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVariantDetailsRouteComponent } from './item-variant-details-route.component';

describe('ItemVariantDetailsRouteComponent', () => {
  let component: ItemVariantDetailsRouteComponent;
  let fixture: ComponentFixture<ItemVariantDetailsRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemVariantDetailsRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVariantDetailsRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
