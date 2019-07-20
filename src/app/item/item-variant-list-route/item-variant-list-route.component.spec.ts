import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemVariantListRouteComponent } from './item-variant-list-route.component';

describe('ItemVariantListRouteComponent', () => {
  let component: ItemVariantListRouteComponent;
  let fixture: ComponentFixture<ItemVariantListRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemVariantListRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemVariantListRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
