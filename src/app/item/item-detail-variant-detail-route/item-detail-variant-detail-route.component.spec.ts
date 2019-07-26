import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ItemDetailVariantDetailRouteComponent} from './item-detail-variant-detail-route.component';

describe('ItemDetailVariantDetailRouteComponent', () => {
  let component: ItemDetailVariantDetailRouteComponent;
  let fixture: ComponentFixture<ItemDetailVariantDetailRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemDetailVariantDetailRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailVariantDetailRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
